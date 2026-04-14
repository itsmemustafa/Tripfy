import React from 'react';
import './PlanPreviewDayDetails.css';

const PlanPreviewDayDetails = ({ planData, activeDay, formatDate }) => {
    if (!planData.days || planData.days.length === 0) {
        return (
            <div className="plan-summary">
                <div className="summary-card">
                    <h3>Plan Overview</h3>
                    <div className="summary-details">
                        <div className="summary-item">
                            <span className="summary-label">Start Date:</span>
                            <span className="summary-value">
                                {formatDate(planData.startDate)}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Duration:</span>
                            <span className="summary-value">
                                {planData.duration} days
                            </span>
                        </div>
                        {planData.note && (
                            <div className="summary-item">
                                <span className="summary-label">Note:</span>
                                <span className="summary-value">{planData.note}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="day-details">
            <div className="day-header">
                <h3>Day {planData.days[activeDay].dayNumber}</h3>
                <p className="day-date">
                    {formatDate(planData.days[activeDay].date)}
                </p>
            </div>

            {planData.days[activeDay].places &&
                planData.days[activeDay].places.length > 0 ? (
                <div className="places-list">
                    {planData.days[activeDay].places.map((placeItem, idx) => (
                        <div key={idx} className="place-card-preview">
                            <div className="place-order">
                                {placeItem.order || idx + 1}
                            </div>
                            <div className="place-content">
                                <div className="place-header">
                                    <h4>{placeItem.place?.name || "Place"}</h4>
                                    {placeItem.visitTime && (
                                        <span className="visit-time">
                                            {placeItem.visitTime}
                                        </span>
                                    )}
                                </div>
                                {placeItem.place?.description && (
                                    <p className="place-description">
                                        {placeItem.place.description}
                                    </p>
                                )}
                                {placeItem.note && (
                                    <div className="place-note">
                                        <span>{placeItem.note}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-places">
                    <p>No places scheduled for this day yet.</p>
                </div>
            )}
        </div>
    );
};

export default PlanPreviewDayDetails;
