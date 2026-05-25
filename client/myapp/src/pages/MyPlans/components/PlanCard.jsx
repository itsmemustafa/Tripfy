import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SharePlanModal from '../../../components/SharePlan/SharePlanModal';

const PLAN_TYPE_LABELS = {
    leisure: 'Leisure',
    adventure: 'Adventure',
    family: 'Family',
    solo: 'Solo',
    romantic: 'Romantic',
    business: 'Business'
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const calculateTotalPlaces = (plan) => {
    const standalonePlaces = plan.places?.length || 0;
    const dayPlaces = plan.days?.reduce((acc, day) => acc + (day.places?.length || 0), 0) || 0;
    return standalonePlaces + dayPlaces;
};

const PlanCard = ({ plan, onInitiateDelete }) => {
    const navigate = useNavigate();
    const [showShare, setShowShare] = useState(false);

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/plan/edit/${plan._id}`);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        setShowShare(true);
    };

    return (
        <>
        <article
            className="plan-card"
            onClick={() => navigate(`/my-plans/${plan._id}`)}
        >
            <div className="plan-card__header">
                <h3 className="plan-card__title">{plan.planTitle}</h3>
                <div className="plan-card__city">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {plan.city}
                </div>
            </div>
            <div className="plan-card__body">
                <div className="plan-card__meta">
                    <div className="plan-card__meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(plan.startDate)}
                    </div>
                    <div className="plan-card__meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {plan.duration} {plan.duration === 1 ? 'day' : 'days'}
                    </div>
                    <div className="plan-card__meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {calculateTotalPlaces(plan)} places
                    </div>
                </div>
                <span className="plan-card__type">
                    {PLAN_TYPE_LABELS[plan.planType] || 'Plan'}
                </span>
            </div>
            <div className="plan-card__footer">
                <span className="plan-card__date">
                    Created {formatDate(plan.createdAt)}
                </span>
                <div className="plan-card__actions">
                    <button
                        className="plan-card__action-btn"
                        onClick={handleShare}
                        title="Share"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>
                    <button
                        className="plan-card__action-btn"
                        onClick={handleEdit}
                        title="Edit"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button
                        className="plan-card__action-btn plan-card__action-btn--delete"
                        onClick={(e) => onInitiateDelete(e, plan._id)}
                        title="Delete"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>

        {showShare && (
            <SharePlanModal
                planId={plan._id}
                planTitle={plan.planTitle}
                onClose={() => setShowShare(false)}
            />
        )}
        </>
    );
};

export default PlanCard;
