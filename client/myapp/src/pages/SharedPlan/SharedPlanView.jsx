import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedPlan } from '../../api/plans';
import './SharedPlanView.css';

const SharedPlanView = () => {
    const { planId } = useParams();
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setIsLoading(true);
                const data = await getSharedPlan(planId);
                setPlan(data.plan);
            } catch (err) {
                setError(err.message || 'This plan is not available. It may be private or no longer exist.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, [planId]);

    if (isLoading) {
        return (
            <div className="spv-loading">
                <div className="spv-spinner" />
                <p>Loading shared plan...</p>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="spv-error">
                <div className="spv-error-icon">🔒</div>
                <h2>Plan Not Available</h2>
                <p>{error || 'This plan does not exist or has not been published yet.'}</p>
                <p className="spv-error-hint">Only <strong>published</strong> plans can be shared. The owner needs to publish the plan first.</p>
                <Link to="/" className="btn btn-primary">Go to Tripfy</Link>
            </div>
        );
    }

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

    return (
        <div className="spv-page">
            {/* Header */}
            <div className="spv-hero">
                <div className="spv-hero-content">
                    <span className="spv-badge">Shared Trip Plan</span>
                    <h1 className="spv-title">{plan.planTitle}</h1>
                    <div className="spv-meta">
                        <span>📍 {plan.city}</span>
                        <span>🗓️ {formatDate(plan.startDate)}</span>
                        <span>⏱️ {plan.duration} day{plan.duration !== 1 ? 's' : ''}</span>
                        <span className={`spv-type-badge spv-type-${plan.planType}`}>{plan.planType}</span>
                    </div>
                    {plan.note && <p className="spv-note">{plan.note}</p>}
                </div>
            </div>

            <div className="spv-container">
                {/* Budget */}
                {plan.budget?.amount > 0 && (
                    <div className="spv-budget-card">
                        <span className="spv-budget-label">Estimated budget</span>
                        <span className="spv-budget-amount">
                            {plan.budget.currency} {plan.budget.amount.toLocaleString()}
                        </span>
                    </div>
                )}

                {/* Days */}
                {plan.days?.length > 0 ? (
                    <div className="spv-days">
                        {plan.days.map((day) => (
                            <div key={day._id || day.dayNumber} className="spv-day-card">
                                <div className="spv-day-header">
                                    <span className="spv-day-number">Day {day.dayNumber}</span>
                                    {day.date && <span className="spv-day-date">{formatDate(day.date)}</span>}
                                </div>
                                <div className="spv-places">
                                    {day.places?.length > 0 ? day.places.map((placeItem, idx) => {
                                        const place = placeItem.place;
                                        return (
                                            <div key={placeItem._id || idx} className="spv-place-row">
                                                <div className="spv-place-img">
                                                    {place?.images?.[0]
                                                        ? <img src={place.images[0]} alt={place.name} />
                                                        : <span>📍</span>}
                                                </div>
                                                <div className="spv-place-info">
                                                    <div className="spv-place-name">{place?.name || 'Unknown Place'}</div>
                                                    <div className="spv-place-meta">
                                                        {place?.category && <span>{place.category}</span>}
                                                        {place?.rating > 0 && <span>⭐ {place.rating.toFixed(1)}</span>}
                                                        {placeItem.visitTime && <span>🕐 {placeItem.visitTime}</span>}
                                                    </div>
                                                    {placeItem.note && <p className="spv-place-note">{placeItem.note}</p>}
                                                </div>
                                                <div className="spv-place-order">#{idx + 1}</div>
                                            </div>
                                        );
                                    }) : (
                                        <p className="spv-no-places">No places scheduled for this day.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="spv-empty-days">
                        <p>This plan has no itinerary days yet.</p>
                    </div>
                )}

                {/* CTA */}
                <div className="spv-cta">
                    <h3>Want to plan your own trip?</h3>
                    <p>Create a free account and use our AI planner to build your perfect Iraq itinerary.</p>
                    <Link to="/" className="btn btn-primary">Get Started on Tripfy</Link>
                </div>
            </div>
        </div>
    );
};

export default SharedPlanView;
