import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', title = '') => {
        const id = Date.now().toString();

        // If no title is provided, infer standard titles based on type
        if (!title) {
            if (type === 'success') title = 'Success';
            if (type === 'error') title = 'Error';
            if (type === 'warning') title = 'Warning';
            if (type === 'info') title = 'Info';
        }

        setToasts(prev => [...prev, { id, message, type, title }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
