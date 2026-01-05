/**
 * Navbar Component
 * Main top navigation bar
 */

import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: '🏠' },
        { path: '/places', label: 'Explore', icon: '🗺️' },
        { path: '/plans', label: 'My Plans', icon: '📋' },
        { path: '/favorites', label: 'Favorites', icon: '❤️' },
    ];

    return (
        <header className="navbar">
            <div className="navbar__container">
                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">✈️</span>
                    <span className="navbar__logo-text">Tripfy</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="navbar__nav">
                    <ul className="navbar__nav-list">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                                >
                                    <span className="navbar__link-icon">{item.icon}</span>
                                    <span className="navbar__link-text">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                        {isAdmin && (
                            <li>
                                <NavLink
                                    to="/admin/places"
                                    className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                                >
                                    <span className="navbar__link-icon">⚙️</span>
                                    <span className="navbar__link-text">Admin</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </nav>

                {/* User Actions */}
                <div className="navbar__actions">
                    {/* Search (Icon only on mobile maybe, full on desktop) */}
                    <div className="navbar__search">
                        <span className="navbar__search-icon">🔍</span>
                        <input type="text" placeholder="Search..." className="navbar__search-input" />
                    </div>

                    <div className="navbar__user-menu">
                        <span className="navbar__user-name">{user?.name?.split(' ')[0]}</span>
                        <div className="navbar__avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <button onClick={handleLogout} className="navbar__logout-btn" title="Logout">
                            🚪
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
