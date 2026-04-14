import React from 'react';
import PlaceChip from './PlaceChip';
import './PlanCard.css';

const PlanCard = ({ planData, onAccept, onRegenerate, isLoading }) => (
    <div className="aip-plan-card">
        <div className="aip-plan-card-header">
            <div>
                <div className="aip-plan-card-title">🏰 {planData.planTitle}</div>
                <div className="aip-plan-card-meta">
                    {planData.city} · {planData.duration} days · {planData.planType}
                    {planData.budget?.amount > 0 && ` · ${planData.budget.currency} ${planData.budget.amount}`}
                </div>
            </div>
        </div>

        {planData.note && (
            <div className="aip-plan-note">{planData.note}</div>
        )}

        {planData.days?.map((day, i) => (
            <div key={i} className="aip-plan-day">
                <div className="aip-plan-day-label">Day {day.dayNumber}</div>
                <div className="aip-plan-places">
                    {day.places?.map((placeItem, idx) => (
                        <PlaceChip key={idx} placeItem={placeItem} />
                    ))}
                    {(!day.places || day.places.length === 0) && (
                        <span className="aip-plan-no-places">No places scheduled for this day.</span>
                    )}
                </div>
            </div>
        ))}

        <div className="aip-plan-card-actions">
            <button className="aip-plan-accept" onClick={() => onAccept(planData)} disabled={isLoading}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                Save Plan
            </button>
            <button className="aip-plan-reject" onClick={() => onRegenerate(planData)} disabled={isLoading}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.85" />
                </svg>
                Modify
            </button>
        </div>
    </div>
);

export default PlanCard;
