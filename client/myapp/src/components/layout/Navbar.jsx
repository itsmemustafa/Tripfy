/**
 * Navbar Component
 * Top navigation bar with search and user actions
 */

import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar__content">
                {/* Search Bar - Placeholder for now */}
                <div className="navbar__search">
                    <span className="navbar__search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search places, plans..."
                        className="navbar__search-input"
                    />
                </div>

                {/* Right Side Actions */}
                <div className="navbar__actions">
                    <button className="navbar__action-btn" aria-label="Notifications">
                        🔔
                        <span className="navbar__notification-badge">2</span>
                    </button>

                    <button className="navbar__action-btn" aria-label="Settings">
                        ⚙️
                    </button>

                    {/* Mobile Profile (visible on small screens potentially) */}
                    <div className="navbar__profile">
                        <span className="navbar__profile-name">Hello, {user?.name?.split(' ')[0] || 'Guest'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
