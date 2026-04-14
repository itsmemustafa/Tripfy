import React from 'react';
import './TimelineProgress.css';

const TimelineProgress = ({ days, expandedDays, toggleDay }) => {
  return (
    <div className="timeline-progress">
      <div className="progress-bar">
        {days?.map((day, index) => (
          <div
            key={index}
            className={`progress-step ${expandedDays.has(index) ? "active" : ""}`}
            onClick={() => toggleDay(index)}
          >
            <div className="progress-dot"></div>
            <span className="progress-label">Day {day.dayNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineProgress;
