/**
 * Sidebar Component
 * Navigation sidebar with logo, links, and user info
 */

import { useAuth } from '../../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const { user, isAdmin, logout } = useAuth();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' },
        { id: 'places', label: 'Explore Places', icon: '🗺️', path: '/places' },
        { id: 'plans', label: 'My Plans', icon: '📋', path: '/plans' },
        { id: 'favorites', label: 'Favorites', icon: '❤️', path: '/favorites' },
    ];

    const adminItems = [
        { id: 'manage-places', label: 'Manage Places', icon: '⚙️', path: '/admin/places' },
        { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar__header">
                <div className="sidebar__logo">
                    <span className="sidebar__logo-icon">✈️</span>
                    {!isCollapsed && <span className="sidebar__logo-text">Tripfy</span>}
                </div>
                <button
                    className="sidebar__toggle"
                    onClick={onToggle}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                <ul className="sidebar__nav-list">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
                                }
                                end={item.path === '/'}
                            >
                                <span className="sidebar__nav-icon">{item.icon}</span>
                                {!isCollapsed && <span className="sidebar__nav-label">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Admin Section */}
                {isAdmin && (
                    <>
                        {!isCollapsed && <div className="sidebar__divider">Admin</div>}
                        <ul className="sidebar__nav-list">
                            {adminItems.map((item) => (
                                <li key={item.id}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `sidebar__nav-item sidebar__nav-item--admin ${isActive ? 'sidebar__nav-item--active' : ''}`
                                        }
                                    >
                                        <span className="sidebar__nav-icon">{item.icon}</span>
                                        {!isCollapsed && <span className="sidebar__nav-label">{item.label}</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </nav>

            {/* User Section */}
            <div className="sidebar__footer">
                {user && (
                    <div className="sidebar__user">
                        <div className="sidebar__user-avatar">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="sidebar__user-info">
                                <span className="sidebar__user-name">{user.name}</span>
                                <span className="sidebar__user-role">{user.role}</span>
                            </div>
                        )}
                    </div>
                )}
                <button
                    className="sidebar__logout"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <span className="sidebar__logout-icon">🚪</span>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
