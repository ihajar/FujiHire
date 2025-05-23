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