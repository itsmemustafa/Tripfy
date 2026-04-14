import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';
import AuthBranding from './components/AuthBranding';
import AuthForm from './components/AuthForm';

const AuthModal = () => {
    const { isModalOpen, modalMode, closeAuthModal, setModalMode, login, signup } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Reset form when modal opens/closes or mode changes
    useEffect(() => {
        if (isModalOpen) {
            setTimeout(() => {
                setFormData({ name: '', email: '', password: '' });
                setError('');
                setSuccessMessage('');
            }, 0);
        }
    }, [isModalOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeAuthModal();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, closeAuthModal]);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (modalMode === 'signup' && formData.name.length < 3) {
            setError('Name must be at least 3 characters');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        let result;
        if (modalMode === 'login') {
            result = await login(formData.email, formData.password);
        } else {
            result = await signup(formData.name, formData.email, formData.password);
        }

        if (!result.success) {
            setError(result.error);
        } else {
            setSuccessMessage(modalMode === 'login' ? 'Welcome back!' : 'Account created successfully!');
            setTimeout(() => {
                closeAuthModal();
            }, 1000);
        }
        setLoading(false);
    };

    const switchMode = () => {
        setModalMode(modalMode === 'login' ? 'signup' : 'login');
        setError('');
        setSuccessMessage('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="auth-overlay" onClick={closeAuthModal}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button className="auth-close" onClick={closeAuthModal} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Modal Content */}
                <div className="auth-content">
                    <AuthBranding modalMode={modalMode} />
                    <AuthForm
                        modalMode={modalMode}
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        successMessage={successMessage}
                        switchMode={switchMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
