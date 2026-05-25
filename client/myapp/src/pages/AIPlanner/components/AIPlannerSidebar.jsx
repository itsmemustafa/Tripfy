import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AIPlannerSidebar.css';

const AIPlannerSidebar = ({ savedPlans, activePlanId, setActivePlanId, handleNewTrip, user, userInitial }) => {
    const navigate = useNavigate();

    return (
        <aside className="aip-sidebar">
            <div className="aip-sidebar-brand">
                <div className="aip-brand-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
                <span className="aip-brand-name">AI Planner</span>
            </div>

            <div className="aip-sidebar-section-label">My Plans</div>
            <div className="aip-plan-list">
                {savedPlans.length === 0 && (
                    <div className="aip-plan-empty">No saved plans yet.<br />Generate one below!</div>
                )}
                {savedPlans.map(plan => (
                    <div
                        key={plan.id}
                        className={`aip-plan-item ${activePlanId === plan.id ? 'aip-plan-item--active' : ''}`}
                        onClick={() => { setActivePlanId(plan.id); navigate(`/my-plans/${plan.id}`); }}
                    >
                        <div className="aip-plan-icon-box">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                                <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            </svg>
                        </div>
                        <div className="aip-plan-text">
                            <span className="aip-plan-title">{plan.title}</span>
                            <span className="aip-plan-sub">{plan.city} · {plan.duration} days</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="aip-sidebar-spacer" />

            <div className="aip-sidebar-footer">
                <button className="aip-new-trip-btn" onClick={handleNewTrip}>
                    + New Trip
                </button>
                {user && (
                    <div className="aip-user-row">
                        <div className="aip-user-avatar">{userInitial}</div>
                        <div className="aip-user-info">
                            <span className="aip-user-name">{user.name}</span>
                            <span className="aip-user-type">Traveler</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AIPlannerSidebar;
