import React, { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { UserRole } from "@/types/user";
import { apiRequest } from "@/utils/api";



export type User = {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
};

type AuthResponse = { user: User; token: string }

type AuthContextType = {
    user: User | null;
     setUser: Dispatch<SetStateAction<User | null>>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
    loginStatus: string;
    signupStatus: string;
    loginError: unknown;
    signupError: unknown;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const queryClient = useQueryClient();

    // fetch user or mount 
    useEffect(() => {
        (async() => {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                try {
                    const authUser = await apiRequest<User>("/api/v1/auth/users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(authUser);
                } catch {
                    setUser(null);
                }
            }
        })();
    }, []);

    const { mutateAsync: loginMutation, status: loginStatus, error: loginError } = useMutation<AuthResponse, Error, { email: string; password: string }>({
        mutationFn: ({ email, password }) => 
            apiRequest<AuthResponse>("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email, 
                    password,
                    role: user?.role || UserRole.JOB_SEEKER
                }),
            }),
            onSuccess: async(data) => {
                await SecureStore.setItemAsync("token", data.token);
                setUser(data.user);
            },
    });

    const login = useCallback(async(email: string, password: string) => {
        try {
            await loginMutation({ email, password });
        } catch (error) {
            throw error;
        }
    }, [loginMutation]);

    const { mutateAsync: signupMutation, status: signupStatus, error: signupError } = useMutation<AuthResponse, Error, { email: string; password: string; role: UserRole }>({
        mutationFn: ({ email, password, role }) => 
            apiRequest<AuthResponse>("/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            }),
            onSuccess: async(data) => {
                await SecureStore.setItemAsync("token", data.token);
                setUser(data.user);
                // queryClient.clear();
            }
    });

    const signup = useCallback(async(email: string, password: string, role: UserRole) => {
        try {
            await signupMutation({ email, password, role });
        } catch (error) {
            throw error;
        }
    }, [signupMutation]);

    const logout = async() => {
        setUser(null);
        await SecureStore.deleteItemAsync("token");
        queryClient.clear();
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                signup,
                logout,
                loginStatus,
                signupStatus,
                loginError,
                signupError,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be within an AuthProvider.");
    }
    return context;
}