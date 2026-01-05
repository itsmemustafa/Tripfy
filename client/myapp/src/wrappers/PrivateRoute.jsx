/**
 * PrivateRoute Component
 * Protects routes that require authentication
 */

import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

/**
 * Wrapper component that redirects unauthenticated users
 * @param {Object} props
 * @param {React.ReactNode} props.children - Protected content
 * @param {React.ReactNode} props.fallback - Content to show when not authenticated
 */
const PrivateRoute = ({ children, fallback = null }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="auth-loading">
                <div className="auth-loading__spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render children
    return children;
};

export default PrivateRoute;
