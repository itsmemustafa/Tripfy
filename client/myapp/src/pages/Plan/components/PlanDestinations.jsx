import React from 'react';
import './PlanDestinations.css';

const PlanDestinations = ({
  activeDay, setActiveDay, duration, dayPlaces, loading, places, togglePlaceSelection, getAssignedDay,
  currentPage, totalPages, handlePageChange
}) => {
  return (
    <div className="plan-places-section">
      <div className="plan-day-selector sticky-day-tabs">
        <span className="day-planner-label">Planning for:</span>
        {Array.from({ length: duration }, (_, i) => i + 1).map(dayNum => {
          const isActive = activeDay === dayNum;
          return (
            <button
              key={dayNum} type="button" onClick={() => setActiveDay(dayNum)}
              className={`day-tab-badge ${isActive ? 'is-active' : ''}`}
            >
              Day {dayNum}
              {dayPlaces[dayNum]?.length > 0 && (
                <span className={`day-tab-count ${isActive ? 'is-active' : ''}`}>
                  {dayPlaces[dayNum].length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="plan-card">
        <h2 className="plan-card__title">Destinations for Day {activeDay}</h2>
        <p className="plan-card__subtitle">
          Click to add places to Day {activeDay}. If a place is already added, clicking will move it.
        </p>

        {loading ? (
          <div className="plan-loading">
            <div className="plan-spinner"></div>
            <p>Loading destinations...</p>
          </div>
        ) : (
          <div className="plan-places-grid">
            {places.map((place) => {
              const assignedDay = getAssignedDay(place._id);
              const isSelected = assignedDay !== null;
              const isFaded = assignedDay && assignedDay !== activeDay;

              return (
                <div
                  key={place._id} role="button" tabIndex={0}
                  className={`plan-place-item ${isSelected ? "is-selected" : ""} ${isFaded ? "is-faded" : ""}`}
                  onClick={() => togglePlaceSelection(place._id)}
                  onKeyDown={(e) => e.key === "Enter" && togglePlaceSelection(place._id)}
                >
                  <div className="plan-place-item__image">
                    <img src={place.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80"} alt={place.name} loading="lazy" />
                    {isSelected && (
                      <div className="plan-place-item__check badge-day-label">
                        <span>Day {assignedDay}</span>
                      </div>
                    )}
                  </div>
                  <div className="plan-place-item__info">
                    <h4>{place.name}</h4>
                    <span className="plan-place-item__location">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {place.location?.city || "Iraq"}
                    </span>
                    {place.rating > 0 && <span className="plan-place-item__rating">{place.rating.toFixed(1)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="pagination-wrapper">
            <button
              className="btn btn-secondary pagination-btn-sm"
              onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pagination-icon-prev">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous
            </button>
            <span className="pagination-text">Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-secondary pagination-btn-sm"
              onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pagination-icon-next">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDestinations;
