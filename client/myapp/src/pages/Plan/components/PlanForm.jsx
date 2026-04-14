import React from 'react';
import { Link } from 'react-router-dom';
import './PlanForm.css';

const PlanForm = ({ tripDetails, handleInputChange, handleSubmit, submitting, message, user, isEditMode, dayPlaces }) => {
  const planTypes = [
    { value: "leisure", label: "Leisure" },
    { value: "adventure", label: "Adventure" },
    { value: "family", label: "Family" },
    { value: "solo", label: "Solo" },
    { value: "romantic", label: "Romantic" },
    { value: "business", label: "Business" },
  ];
  const cities = ["Erbil", "Sulaymaniyah", "Duhok"];
  const totalSelectedPlaces = Object.values(dayPlaces).reduce((acc, list) => acc + list.length, 0);

  return (
    <div className="plan-form-section">
      <div className="ai-planner-btn-container">
        <Link to="/ai-planner" className="btn-ai-magic nav-link-nounderline">
          Open Trip Assistant
        </Link>
      </div>

      <div className="plan-card">
        <h2 className="plan-card__title">Trip Details</h2>
        {!user && (
          <div className="plan-login-prompt">
            <p>You need to log in to save your trip plan.</p>
          </div>
        )}
        {message.text && (
          <div className={`plan-message plan-message--${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="plan-form">
          <div className="form-group">
            <label htmlFor="title">Trip Name</label>
            <input type="text" id="title" name="title" value={tripDetails.title} onChange={handleInputChange} placeholder="My Kurdistan Adventure" required />
          </div>

          <div className="form-group">
            <label htmlFor="city">Destination City</label>
            <select id="city" name="city" value={tripDetails.city} onChange={handleInputChange}>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (Days)</label>
              <input type="number" id="duration" name="duration" value={tripDetails.duration} onChange={handleInputChange} min="1" max="30" required />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input type="date" id="startDate" name="startDate" value={tripDetails.startDate} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group">
            <span className="form-group__label">Trip Type</span>
            <div className="plan-types">
              {planTypes.map((type) => (
                <button
                  key={type.value} type="button"
                  className={`plan-type-btn ${tripDetails.planType === type.value ? "is-active" : ""}`}
                  onClick={() => handleInputChange({ target: { name: 'planType', value: type.value } })}
                >
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">Notes (Optional)</label>
            <textarea id="note" name="note" value={tripDetails.note} onChange={handleInputChange} placeholder="Any special requirements..." rows="3" />
          </div>

          <div className="plan-summary">
            <div className="plan-summary__item">
              <span>{totalSelectedPlaces} places selected</span>
            </div>
            <div className="plan-summary__item">
              <span>{tripDetails.duration} days</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg plan-submit" disabled={submitting || !user}>
            {submitting ? (
              <>
                <span className="plan-spinner spinner-inline"></span>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                {isEditMode ? "Update Trip Plan" : "Create Trip Plan"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlanForm;
