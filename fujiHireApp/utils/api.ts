
import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface IRequestParams<T> {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    contentType?: 'application/json' | 'multipart/form-data';
    body?: BodyInit | FormData;
    headers?: Record<string, string>;
}

export const request = async<T>({
    endpoint,
    method = 'GET',
    body,
    contentType = 'application/json',
    headers = {},
}: IRequestParams<T>): Promise<T> => {
    const token = await SecureStore.getItemAsync('token');
    const defaultHeaders: Record<string, string> = {};

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    if (contentType === 'application/json') {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const finalHeaders = {
        ...defaultHeaders,
        ...headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: finalHeaders,
            body: contentType === 'application/json' && body ? JSON.stringify(body) : body as FormData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'An error occurred';
            throw new Error(errorMessage);
        }

        const emptyRes = await response.text();
        return emptyRes ? JSON.parse(emptyRes) : ({} as T);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Something went wrong. Please try again later!');
    }
};