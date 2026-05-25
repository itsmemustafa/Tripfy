import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/Auth/AuthModal';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BottomNav from '../components/layout/BottomNav';

const MainLayoutContent = () => {
    const { openAuthModal } = useAuth();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const isLanding = pathname === '/';

    return (
        <div className="app-layout">
            <Header />
            <main className="app-content">
                <Outlet context={{ openAuthModal }} />
            </main>
            {isLanding && <Footer />}
            <BottomNav />
            <AuthModal />
        </div>
    );
};

const MainLayout = () => {
    return <MainLayoutContent />;
};

export default MainLayout;
