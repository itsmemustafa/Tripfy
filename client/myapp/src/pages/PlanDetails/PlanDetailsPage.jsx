import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePlanDetailsPage } from './hooks/usePlanDetailsPage';

import PlanEditor from '../../components/PlanEditor/PlanEditor';
import SharePlanModal from '../../components/SharePlan/SharePlanModal';

import './PlanDetailsPage.css';

const PlanDetailsPage = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const { 
        plan, setPlan, isLoading, error, 
        showShare, setShowShare, handleSave 
    } = usePlanDetailsPage(planId);

    const handleCancel = () => {
        navigate('/my-plans');
    };

    if (isLoading) {
        return (
            <div className="plan-details-loading">
                <div className="spinner"></div>
                <p>Loading plan...</p>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="plan-details-error">
                <h2>Error</h2>
                <p>{error || 'Plan not found'}</p>
                <button className="btn btn-primary" onClick={() => navigate('/my-plans')}>
                    Back to My Plans
                </button>
            </div>
        );
    }

    const isOwner = user && plan.user === user.userId;

    return (
        <div className="plan-details-page">
            <div className="plan-action-bar">
                <button className="btn btn-secondary" onClick={handleCancel}>
                    Back
                </button>
                <div className="action-buttons">
                    <button className="btn btn-outline" onClick={() => setShowShare(true)}>
                        Share
                    </button>
                    {isOwner && plan.status === 'draft' && (
                        <button
                            className="btn btn-primary"
                            onClick={() => handleSave({ ...plan, status: 'published' })}
                        >
                            Publish Plan
                        </button>
                    )}
                </div>
            </div>

            <PlanEditor
                initialPlan={plan}
                onSave={handleSave}
                onCancel={handleCancel}
                isViewOnly={!isOwner}
            />

            {showShare && (
                <SharePlanModal
                    planId={plan._id}
                    planTitle={plan.planTitle}
                    onClose={() => setShowShare(false)}
                />
            )}
        </div>
    );
};

export default PlanDetailsPage;
