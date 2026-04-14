import React from 'react';
import './PlanPreviewTimeline.css';

const PlanPreviewTimeline = ({ planData, getPlanTypeColor, activeDay, setActiveDay, formatDate }) => {
    if (!planData.days || planData.days.length === 0) return null;

    return (
        <div className="timeline-nav">
            {planData.days.map((day, index) => (
                <button
                    key={index}
                    className={`timeline-day-btn ${activeDay === index ? "active" : ""}`}
                    onClick={() => setActiveDay(index)}
                    style={{
                        borderColor: activeDay === index
                            ? getPlanTypeColor(planData.planType)
                            : "#e5e7eb",
                    }}
                >
                    <div className="timeline-day-number">Day {day.dayNumber}</div>
                    <div className="timeline-day-date">
                        {formatDate(day.date)}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default PlanPreviewTimeline;
