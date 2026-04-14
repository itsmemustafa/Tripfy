import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './BottomNav.css';

const BottomNav = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, openAuthModal, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll listener to hide/show nav
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Allow showing nav at the very top
            if (currentScrollY < 10) {
                setIsVisible(true);
            }
            // Hide when scrolling down
            else if (currentScrollY > lastScrollY.current + 5) {
                setIsVisible(false);
            }
            // Show when scrolling up
            else if (currentScrollY < lastScrollY.current - 5) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show on AI Planner (it has its own layout)
    if (pathname === '/ai-planner') return null;

    const tabs = [
        {
            label: 'Home',
            to: '/',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            ),
        },
        {
            label: 'Explore',
            to: '/places',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            ),
        },
        {
            label: 'AI',
            to: '/ai-planner',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ),
        },
        {
            label: 'Map',
            to: '/map',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
            ),
        },
        {
            label: 'Plans',
            to: '/my-plans',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
    ];


    const getIsActive = (tab) => {
        if (tab.to === '/') return pathname === '/';
        if (tab.to) return pathname.startsWith(tab.to);
        if (tab.id === 'profile') return showProfileMenu;
        return false;
    };

    const handleTabClick = (e, tab) => {
        if (tab.id === 'profile') {
            e.preventDefault();
            if (!isAuthenticated) {
                openAuthModal('login');
            } else {
                setShowProfileMenu(!showProfileMenu);
            }
            return;
        }

        if (tab.to === '/my-plans' && !isAuthenticated) {
            e.preventDefault();
            openAuthModal('login');
            return;
        }

        setShowProfileMenu(false);
    };

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    };

    const handleAdminClick = () => {
        navigate('/admin');
        setShowProfileMenu(false);
    };

    return (
        <>
            {/* Profile Popup Menu */}
            {showProfileMenu && isAuthenticated && (
                <div className="btm-nav__profile-menu" ref={menuRef}>
                    <div className="btm-nav__profile-header">
                        <div className="btm-nav__profile-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="btm-nav__profile-info">
                            <span className="btm-nav__profile-name">{user?.name}</span>
                            <span className="btm-nav__profile-role">{user?.role === 'admin' ? 'Administrator' : 'Traveler'}</span>
                        </div>
                    </div>
                    <div className="btm-nav__profile-actions">
                        {user?.role === 'admin' && (
                            <button className="btm-nav__profile-btn" onClick={handleAdminClick}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                Admin Panel
                            </button>
                        )}
                        <button className="btm-nav__profile-btn btm-nav__profile-btn--danger" onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Log Out
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Bar */}
            <nav className={`btm-nav ${!isVisible ? 'btm-nav--hidden' : ''}`} aria-label="Main navigation">
                <div className="btm-nav__bar">
                    {tabs.map((tab) => {
                        const active = getIsActive(tab);
                        const isActionTab = !tab.to;

                        // Content for the tab
                        const content = (
                            <>
                                <span className="btm-nav__icon">{tab.icon}</span>
                                {active && <span className="btm-nav__label">{tab.label}</span>}
                            </>
                        );

                        // If it's a navigational tab
                        if (!isActionTab) {
                            return (
                                <NavLink
                                    key={tab.to}
                                    to={tab.to}
                                    className={`btm-nav__tab ${active ? 'btm-nav__tab--active' : ''}`}
                                    onClick={(e) => handleTabClick(e, tab)}
                                >
                                    {content}
                                </NavLink>
                            );
                        }

                        // If it's an action tab (Profile)
                        return (
                            <button
                                key={tab.id}
                                className={`btm-nav__tab ${active ? 'btm-nav__tab--active' : ''}`}
                                onClick={(e) => handleTabClick(e, tab)}
                            >
                                {content}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
