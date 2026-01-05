/**
 * MainLayout Component
 * Main wrapper for authenticated pages, managing sidebar and navbar
 */

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="main-layout">
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

            <div className={`main-layout__content-wrapper ${isSidebarCollapsed ? 'main-layout__content-wrapper--expanded' : ''}`}>
                <Navbar />
                <main className="main-layout__page-content">
                    <div className="main-layout__container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
