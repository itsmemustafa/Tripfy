import React from 'react';
import './PlanPreviewHeader.css';

const PlanPreviewHeader = ({ planData, getPlanTypeColor, onClose }) => {
    return (
        <div
            className="plan-preview-header"
            style={{
                background: `linear-gradient(135deg, ${getPlanTypeColor(planData.planType)}, ${getPlanTypeColor(planData.planType)}dd)`,
            }}
        >
            <div className="plan-preview-header-content">
                <div className="plan-preview-title-section">
                    <h2>{planData.planTitle}</h2>
                    <div className="plan-preview-meta">
                        <span
                            className="badge badge-type"
                            style={{ background: getPlanTypeColor(planData.planType) }}
                        >
                            {planData.planType}
                        </span>
                        <span className="badge badge-city">{planData.city}</span>
                        <span className="badge badge-duration">
                            {planData.duration} Days
                        </span>
                        {planData.budget?.amount && (
                            <span className="badge badge-budget">
                                {planData.budget.amount} {planData.budget.currency}
                            </span>
                        )}
                    </div>
                </div>
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default PlanPreviewHeader;
