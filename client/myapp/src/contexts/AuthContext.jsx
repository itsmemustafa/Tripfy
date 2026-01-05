/**
 * Auth Context
 * Provides authentication state and actions throughout the app
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/authApi';
import { getStoredTokens, getStoredUser, clearTokens } from '../api/config';

// Create context
export const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the app and provides auth state and actions
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const initAuth = () => {
            const storedUser = getStoredUser();
            const { accessToken: storedToken } = getStoredTokens();

            if (storedUser && storedToken) {
                setUser(storedUser);
                setAccessToken(storedToken);
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    // Login action
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        try {
            const data = await apiLogin(email, password);
            setUser(data.user);
            setAccessToken(data.accessToken);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Signup action
    const signup = useCallback(async (name, email, password) => {
        setIsLoading(true);
        try {
            const data = await apiSignup(name, email, password);
            setUser(data.user);
            setAccessToken(data.accessToken);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout action
    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await apiLogout();
        } finally {
            setUser(null);
            setAccessToken(null);
            clearTokens();
            setIsLoading(false);
        }
    }, []);

    // Computed values
    const isAuthenticated = !!user && !!accessToken;
    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        accessToken,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
