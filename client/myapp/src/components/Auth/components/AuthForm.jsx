import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ 
    modalMode, 
    formData, 
    handleChange, 
    handleSubmit, 
    loading, 
    error, 
    successMessage, 
    switchMode 
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="auth-form-container">
            <div className="auth-form-header">
                <h3 className="auth-form-title">
                    {modalMode === 'login' ? 'Sign In' : 'Create Account'}
                </h3>
                <p className="auth-form-subtitle">
                    {modalMode === 'login'
                        ? 'Enter your credentials to continue'
                        : 'Fill in your details to get started'}
                </p>
            </div>

            {successMessage && (
                <div className="auth-success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="auth-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
                {modalMode === 'signup' && (
                    <div className="auth-field">
                        <label htmlFor="name" className="auth-label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="auth-input"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                        />
                    </div>
                )}

                <div className="auth-field">
                    <label htmlFor="email" className="auth-label">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="auth-input"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="password" className="auth-label">
                        Password
                    </label>
                    <div className="auth-password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className="auth-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete={modalMode === 'login' ? 'current-password' : 'new-password'}
                        />
                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {modalMode === 'signup' && (
                        <span className="auth-hint">Must be at least 6 characters</span>
                    )}
                </div>

                <button
                    type="submit"
                    className={`auth-submit ${loading ? 'is-loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="auth-spinner"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            {modalMode === 'login' ? 'Sign In' : 'Create Account'}
                        </>
                    )}
                </button>
            </form>

            <div className="auth-divider">
                <span>or</span>
            </div>

            <div className="auth-switch">
                <p>
                    {modalMode === 'login'
                        ? "Don't have an account?"
                        : "Already have an account?"}
                </p>
                <button type="button" className="auth-switch-btn" onClick={switchMode}>
                    {modalMode === 'login' ? 'Create Account' : 'Sign In'}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
