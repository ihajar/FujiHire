import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import { usePathname, useRouter } from "expo-router";
import { UserRole } from "@/types/user";
import { request } from "@/utils/api";
import { AppRoutes } from '@/types/routes';
import AuthLoadingScreen from "@/components/AuthLoadingScreen";


interface IAuthResponse {
    token: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
}

interface IAuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<IAuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}

export function AuthProvider({ children } : PropsWithChildren) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // query to fetch current user
    const { data: user, isPending } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async() => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (!token) return null;
                return await request<User>({
                    endpoint: '/api/v1/auth/users/me',
                    method: 'GET',
                });
            } catch (error) {
                await SecureStore.deleteItemAsync('token');
                return null;
            }
        },
    });

    // Handle initial route check
    useEffect(() => {
        if (isPending || initialCheckDone) return;

        const isOnAuthPage = [
            '/(protected)/login',
            '/(protected)/signup',
            '/(protected)/request-password-reset'
        ].includes(pathname);

        if (!user && !isOnAuthPage) {
            router.replace('/');
        } else if (user && !user.emailVerified && pathname !== '/(protected)/verify-email') {
            router.replace('/(protected)/verify-email');
        } else if (user && user.emailVerified && pathname === '/(protected)/verify-email') {
            router.replace('/(protected)/(tabs)');
        } else if (user && isOnAuthPage) {
            router.replace('/(protected)/(tabs)');
        }

        setInitialCheckDone(true);
    }, [user, isPending, pathname, initialCheckDone]);

    const loginMutation = useMutation({
        mutationFn: async({ email, password }: { email: string, password: string }) => {
            setIsLoading(true);
            return await request<IAuthResponse>({
                endpoint: '/api/v1/auth/login',
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    role: user?.role || UserRole.JOB_SEEKER
                }),
            });
        },
        onSuccess: async(data) => {
            await SecureStore.setItemAsync('token', data.token);
            queryClient.setQueryData(['currentUser'], data.user);
        },
        onError: (error) => {
            console.error('Login failed: ', error);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const signupMutation = useMutation({
        mutationFn: async({ email, password, role }: { email: string, password: string, role: UserRole }) => {
            return await request<IAuthResponse>({
                endpoint: '/api/v1/auth/register',
                method: 'POST',
                body: JSON.stringify({ email, password, role }),
            });
        },
        onSuccess: async(data) => {
            await SecureStore.setItemAsync('token', data.token);
            queryClient.setQueryData(['currentUser'], data.user);
        },
        onError: (error) => {
            console.error('Sign up failed: ', error);
        },
    });

    const login = async( email: string, password: string ) => {
        await loginMutation.mutateAsync({ email, password });
    };

    const signup = async( email: string, password: string, role: UserRole ) => {
        await signupMutation.mutateAsync({ email, password, role });
    };

    const logout = async() => {
        setInitialCheckDone(false);
        await SecureStore.deleteItemAsync('token');
        queryClient.removeQueries({ queryKey: ['currentUser'] });
        queryClient.clear();
        router.replace('/(protected)/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                setUser: (user) => queryClient.setQueryData(['currentUser'], user),
                login,
                signup,
                logout,
                isAuthenticated: !!user,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}