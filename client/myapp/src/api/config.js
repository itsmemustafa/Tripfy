/**
 * API Configuration
 * Base URL and fetch wrapper with authentication
 */

export const API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Get stored tokens from localStorage
 */
export const getStoredTokens = () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
});

/**
 * Store tokens in localStorage
 */
export const storeTokens = (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Clear tokens from localStorage
 */
export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

/**
 * Store user data in localStorage
 */
export const storeUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Attempt to refresh the access token
 */
const attemptTokenRefresh = async () => {
    const { refreshToken } = getStoredTokens();

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        clearTokens();
        throw new Error('Token refresh failed');
    }

    const data = await response.json();
    storeTokens(data.accessToken, data.newRefreshToken);

    return data.accessToken;
};

/**
 * Fetch wrapper with automatic token attachment and refresh
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @param {boolean} requireAuth - Whether auth is required
 */
export const apiFetch = async (endpoint, options = {}, requireAuth = true) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Attach auth token if required
    if (requireAuth) {
        const { accessToken } = getStoredTokens();
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    let response = await fetch(url, {
        ...options,
        headers,
    });

    // If unauthorized and we have auth, try to refresh token
    if (response.status === 401 && requireAuth) {
        try {
            const newAccessToken = await attemptTokenRefresh();
            headers['Authorization'] = `Bearer ${newAccessToken}`;

            // Retry the original request
            response = await fetch(url, {
                ...options,
                headers,
            });
        } catch (error) {
            // Refresh failed, clear tokens and throw
            clearTokens();
            throw new Error('Session expired. Please login again.');
        }
    }

    // Parse response
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.msg || data.message || 'Request failed');
    }

    return data;
};
