/**
 * MainLayout Component
 * Wrapper for authenticated pages with just Navbar (no sidebar)
 */

import Navbar from './Navbar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Navbar />

            <main className="main-layout__content">
                <div className="main-layout__container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
