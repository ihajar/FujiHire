import * as SecureStore  from 'expo-secure-store';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { apiRequest, loginUser, signupUser } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { UserRole } from '@/types/user';
import AuthLoadingScreen from '@/components/AuthLoadingScreen';

// Define types for login payload and response
interface AuthPayload {
  email: string;
  password: string;
  role: UserRole;
}
interface AuthResponse {
  token: string;
  user: any;
}

export type User = {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
}

type AuthContextType = {
    user: any;
    setUser: (user: any) => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Use object syntax for useMutation (React Query v5+)
    const loginMutation = useMutation({
        mutationFn: (data: AuthPayload) => loginUser(data),
        onSuccess: async (data: AuthResponse) => {
            await SecureStore.setItemAsync('token', data.token);
            setUser(data.user);
            setIsLoggedIn(true);
        },
        onError: (error: any) => {
            console.error("Login error:", error);
            throw error; // Re-throw to handle in the component
        },
    });

    // Login function
    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password, role: user?.role || UserRole.JOB_SEEKER });
    };

    const signupMutation = useMutation({
        mutationFn: (data: AuthPayload) => signupUser(data),
        onSuccess: async(data: AuthResponse) => {
            await SecureStore.setItemAsync('token', data.token);
            setUser(data.user);
            setIsLoggedIn(true);
        },
        onError: (error: any) => {
            console.error("Signup error:", error);
            throw error; // Re-throw to handle in the component
        }
    })

    // Signup function
    const signup = async (email: string, password: string, role: UserRole) => {
        await signupMutation.mutateAsync({ email, password, role });
    };
    // Logout function
    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        setUser(null);
    };

    useEffect(() => {
        const checkAuthStatus = async() => {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                try {
                    const authUser = await apiRequest<User>('/api/v1/auth/users/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(authUser);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error("Error checking auth status:", error);
                    setUser(null);
                    setIsLoggedIn(false);
                    setLoading(false);
                }
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
            setLoading(false);
        }
        checkAuthStatus();
    }, [])

    return (
      <AuthContext.Provider 
        value={{ 
            user, 
            setUser,
            login,
            signup,
            logout, 
            isLoggedIn,
            loading 
        }}>
        {loading ? <AuthLoadingScreen /> : children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctxt = useContext(AuthContext);
    if (!ctxt) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctxt;
}