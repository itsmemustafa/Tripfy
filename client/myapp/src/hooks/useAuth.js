/**
 * useAuth Hook
 * Custom hook to access auth context
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook to access authentication state and actions
 * @returns {{
 *   user: Object|null,
 *   accessToken: string|null,
 *   isAuthenticated: boolean,
 *   isAdmin: boolean,
 *   isLoading: boolean,
 *   login: (email: string, password: string) => Promise,
 *   signup: (name: string, email: string, password: string) => Promise,
 *   logout: () => Promise
 * }}
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;
