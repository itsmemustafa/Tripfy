import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddToItineraryModal.css";


const AddToItineraryModal = ({
  isOpen,
  onClose,
  plans,
  onAddToPlan,
  placeName,
  loading,
}) => {
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAddClick = async () => {
    if (!selectedPlanId) return;

    setIsAdding(true);
    try {
      await onAddToPlan(selectedPlanId);
      onClose();
    } catch (error) {
      console.error("Error adding to plan:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreateNewPlan = () => {
    onClose();
    navigate("/plan");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content add-itinerary-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add to Itinerary</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p className="add-itinerary-modal__subtitle">
            Select a trip to add <strong>{placeName}</strong> to:
          </p>

          {loading ? (
            <div className="add-itinerary-modal__loading">
              <div className="spinner"></div>
              <p>Loading your trips...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="add-itinerary-modal__empty">
              <div className="add-itinerary-modal__empty-icon">Map</div>
              <h3>No trips yet</h3>
              <p>Create your first trip to start planning your adventure!</p>
              <button className="btn btn-primary" onClick={handleCreateNewPlan}>
                Create New Trip
              </button>
            </div>
          ) : (
            <>
              <div className="add-itinerary-modal__plans">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`plan-option ${selectedPlanId === plan._id ? "plan-option--selected" : ""}`}
                    onClick={() => setSelectedPlanId(plan._id)}
                  >
                    <div className="plan-option__radio">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlanId === plan._id}
                        onChange={() => setSelectedPlanId(plan._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="plan-option__content">
                      <h4 className="plan-option__title">{plan.planTitle}</h4>
                      <div className="plan-option__meta">
                        <span className="plan-option__meta-item">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {plan.city}
                        </span>
                        <span className="plan-option__meta-item">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formatDate(plan.startDate)}
                        </span>
                        <span className="plan-option__meta-item">
                          {plan.places?.length || 0} places
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-itinerary-modal__divider">
                <span>or</span>
              </div>

              <button
                className="btn btn-secondary add-itinerary-modal__new-btn"
                onClick={handleCreateNewPlan}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create New Trip
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && plans.length > 0 && (
          <div className="modal-footer">
            <button
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddClick}
              disabled={!selectedPlanId || isAdding}
            >
              {isAdding ? (
                <>
                  <div className="btn-spinner"></div>
                  Adding...
                </>
              ) : (
                "Add to Trip"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToItineraryModal;
