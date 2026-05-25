import React from 'react';
import './PlanPreviewActions.css';

const PlanPreviewActions = ({ planData, getPlanTypeColor, onRegenerate, onAccept, isLoading }) => {
    return (
        <div className="plan-preview-actions">
            <button
                className="btn btn-secondary"
                onClick={onRegenerate}
                disabled={isLoading}
            >
                Regenerate
            </button>
            <button
                className="btn btn-primary"
                onClick={() => onAccept(planData)}
                disabled={isLoading}
                style={{ background: getPlanTypeColor(planData.planType) }}
            >
                Accept and Continue
            </button>
        </div>
    );
};

export default PlanPreviewActions;
