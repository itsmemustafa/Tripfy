import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AIPlannerHeader.css';

const AIPlannerHeader = ({ currentPlan, savedPlansCount }) => {
    const navigate = useNavigate();

    return (
        <div className="aip-header">
            <div className="aip-header-left">
                <button className="aip-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1 className="aip-header-title">Trip Planner Assistant</h1>
                <p className="aip-header-subtitle">
                    {currentPlan
                        ? `Editing: ${currentPlan.planTitle} · ${currentPlan.city}`
                        : 'Describe your trip and get a real-data itinerary in seconds'}
                </p>
            </div>
            <div className="aip-header-badges">
                <span className="aip-badge aip-badge--primary">AI-Powered</span>
                {currentPlan && (
                    <span className="aip-badge aip-badge--context">
                        {currentPlan.city} · {currentPlan.duration}d
                    </span>
                )}
                <span className="aip-badge aip-badge--muted">Real Places · {savedPlansCount} Saved</span>
            </div>
        </div>
    );
};

export default AIPlannerHeader;
