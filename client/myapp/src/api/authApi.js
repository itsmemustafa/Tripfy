/**
 * Auth API Service
 * Handles authentication endpoints
 */

import { API_BASE_URL, storeTokens, storeUser, clearTokens } from './config';

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user, accessToken, refreshToken}>}
 */
export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
    }

    // Store tokens and user
    storeTokens(data.accessToken, data.refreshToken);
    storeUser(data.user);

    return data;
};

/**
 * Register new user
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user, accessToken, refreshToken}>}
 */
export const signup = async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
    }

    // Store tokens and user
    storeTokens(data.accessToken, data.refreshToken);
    storeUser(data.user);

    return data;
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Ignore logout errors, still clear local storage
        console.warn('Logout request failed:', error);
    }

    // Always clear tokens
    clearTokens();
};

/**
 * Refresh access token
 * @param {string} refreshToken 
 * @returns {Promise<{accessToken, newRefreshToken}>}
 */
export const refreshAccessToken = async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
        clearTokens();
        throw new Error(data.msg || 'Token refresh failed');
    }

    // Update stored tokens
    storeTokens(data.accessToken, data.newRefreshToken);

    return data;
};
