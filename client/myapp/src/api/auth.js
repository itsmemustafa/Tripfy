import { env } from '../config/env.js';
import { clearAccessToken, request, setAccessToken } from './client.js';

const BASE_URL = env.api.endpoints.auth;

export const loginUser = async (email, password) => {
    const data = await request(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (data?.accessToken) {
        setAccessToken(data.accessToken);
    }
    return data;
};

export const registerUser = async (name, email, password) => {
    const data = await request(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });
    if (data?.accessToken) {
        setAccessToken(data.accessToken);
    }
    return data;
};

export const logoutUser = async () => {
    try {
        await request(`${BASE_URL}/logout`, {
        method: 'POST',
    });
    } catch {
        return null;
    } finally {
        clearAccessToken();
    }
};

export const getCurrentUser = async () => {
    try {
        return await request(`${BASE_URL}/me`, { method: 'GET' });
    } catch {
        return null;
    }
};
