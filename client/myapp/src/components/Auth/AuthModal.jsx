import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AuthModal.css';

const AuthModal = () => {
    const { isModalOpen, modalMode, closeAuthModal, setModalMode, login, signup } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let result;
        if (modalMode === 'login') {
            result = await login(formData.email, formData.password);
        } else {
            result = await signup(formData.name, formData.email, formData.password);
        }

        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    const switchMode = () => {
        setModalMode(modalMode === 'login' ? 'signup' : 'login');
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="auth-overlay" onClick={closeAuthModal}>
            <div className="auth-container" onClick={e => e.stopPropagation()}>
                <button className="auth-close" onClick={closeAuthModal}>&times;</button>

                <h2 className="auth-title">
                    {modalMode === 'login' ? 'Welcome Back' : 'Join Us'}
                </h2>
                <p className="auth-subtitle">
                    {modalMode === 'login'
                        ? 'Enter your details to access your account'
                        : 'Create an account to start your journey'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {modalMode === 'signup' && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Processing...' : (modalMode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="auth-switch">
                    {modalMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button type="button" className="switch-btn" onClick={switchMode}>
                        {modalMode === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
