/**
 * RoleGuard Component
 * Protects routes based on user role
 */

import { useAuth } from '../hooks/useAuth';

/**
 * Wrapper component that checks user role before rendering
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of allowed roles (e.g., ['admin'])
 * @param {React.ReactNode} props.children - Protected content
 * @param {React.ReactNode} props.fallback - Content to show when role not allowed
 */
const RoleGuard = ({ allowedRoles = [], children, fallback = null }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="auth-loading">
                <div className="auth-loading__spinner"></div>
                <p>Checking permissions...</p>
            </div>
        );
    }

    // Must be authenticated first
    if (!isAuthenticated) {
        return fallback;
    }

    // Check if user's role is in allowed roles
    const hasRequiredRole = user?.role && allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
        return fallback || (
            <div className="access-denied">
                <div className="access-denied__icon">🚫</div>
                <h2>Access Denied</h2>
                <p>You don't have permission to view this page.</p>
            </div>
        );
    }

    // User has required role, render children
    return children;
};

export default RoleGuard;
