import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('login'); // 'login' or 'signup'

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
            // Usually signup logs you in automatically
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

    return (
        <AuthContext.Provider value={{
            user,
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
