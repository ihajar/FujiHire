import { UserRole } from "@/types/user";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'An error occured');
    }
    return response.json();
}

interface AuthPayload {
    email: string;
    password: string;
    role: UserRole;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export const loginUser = (data: AuthPayload) : Promise<AuthResponse> => {
    return apiRequest(`/api/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export const signupUser = (data: AuthPayload): Promise<AuthResponse> => {
    return apiRequest('/api/v1/register', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
}