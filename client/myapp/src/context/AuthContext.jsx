import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('login');
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await getCurrentUser();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const openAuthModal = (mode = 'login') => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsModalOpen(false);
    };

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            setUser(data.user);
            closeAuthModal();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const data = await registerUser(name, email, password);
          
            setUser(data.user);
            closeAuthModal();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="places__spinner"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isModalOpen,
            modalMode,
            openAuthModal,
            closeAuthModal,
            login,
            signup,
            logout,
            setModalMode
        }}>
            {children}
        </AuthContext.Provider>
    );
};
