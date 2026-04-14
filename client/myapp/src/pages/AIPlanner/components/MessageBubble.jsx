import React from 'react';
import PlanCard from './PlanCard';
import './MessageBubble.css';

const MessageBubble = ({ msg, userInitial, onAccept, onRegenerate, onSuggestionClick, isLoading }) => {
    const isUser = msg.sender === 'user';

    return (
        <div className={`aip-message aip-message--${msg.sender}`}>
            <div className={`aip-avatar aip-avatar--${msg.sender}`}>
                {isUser ? userInitial : 'AI'}
            </div>
            <div className="aip-bubble-wrap">
                {/* Detected context pill */}
                {msg.detectedContext && (
                    <div className="aip-context-pill">
                        <span>📍 {msg.detectedContext.city}</span>
                        <span>📅 {msg.detectedContext.duration} days</span>
                        <span>🏷️ {msg.detectedContext.planType}</span>
                    </div>
                )}

                {msg.content && (
                    <div className={`aip-bubble ${isUser ? 'aip-bubble--user' : msg.type === 'success' ? 'aip-bubble--success' : msg.type === 'login-required' ? 'aip-bubble--login' : 'aip-bubble--ai'}`}>
                        {msg.type === 'login-required' && (
                            <div className="aip-login-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                        )}
                        <p>{msg.content}</p>
                    </div>
                )}

                {msg.suggestedActions?.length > 0 && (
                    <div className="aip-chips-row aip-chips-row--msg">
                        {msg.suggestedActions.map((action, i) => (
                            <button
                                key={i}
                                className={`aip-chip ${(action === 'Log in' || action === 'Sign up') ? 'aip-chip--auth' : ''}`}
                                onClick={() => onSuggestionClick(action)}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                {msg.type === 'plan' && msg.planData && (
                    <PlanCard
                        planData={msg.planData}
                        onAccept={onAccept}
                        onRegenerate={onRegenerate}
                        isLoading={isLoading}
                    />
                )}

                {msg.type === 'success' && msg.planId && (
                    <div className="aip-saved-link">
                        <button
                            className="aip-view-plan-btn"
                            onClick={() => onSuggestionClick('View saved plan')}
                        >
                            View in My Plans →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
