import React from 'react';
import './AuthBranding.css';

const AuthBranding = ({ modalMode }) => {
    return (
        <div className="auth-branding">
            <div className="auth-branding__content">
                <div className="auth-branding__logo">
                    <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" />
                        <path d="M12 28C14 22 18 14 28 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M16 20C18 16 22 14 28 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="28" cy="12" r="3" fill="currentColor" />
                    </svg>
                    <span>Tripfy</span>
                </div>
                <h2 className="auth-branding__title">
                    {modalMode === 'login'
                        ? 'Welcome Back!'
                        : 'Start Your Journey'}
                </h2>
                <p className="auth-branding__text">
                    {modalMode === 'login'
                        ? 'Sign in to access your personalized travel plans and discover new adventures in Iraq.'
                        : 'Create an account to start planning your dream trip through the beautiful landscapes of Iraq.'}
                </p>
                <div className="auth-branding__features">
                    <div className="auth-branding__feature">

                        <span>Save your favorite places</span>
                    </div>
                    <div className="auth-branding__feature">

                        <span>Create custom itineraries</span>
                    </div>
                    <div className="auth-branding__feature">

                        <span>Write reviews & ratings</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthBranding;
