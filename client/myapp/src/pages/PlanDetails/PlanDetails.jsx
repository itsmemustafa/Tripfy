import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { usePlanDetails } from "./hooks/usePlanDetails";

import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import PlanDetailsHeader from "./components/PlanDetailsHeader";
import PlanTimeline from "./components/PlanTimeline";

import "./PlanDetails.css";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const {
    plan, loading, error, showDeleteModal, setShowDeleteModal,
    handlePlanDelete, handleDeleteDay, onDragEnd
  } = usePlanDetails(id, user, showToast, navigate);

  if (!user) {
    return (
      <div className="plan-details-page">
        <div className="container plan-details-auth-prompt">
          <p>Please log in to view your trip details.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="plan-details-page">
        <div className="plan-details-loading">
          <div className="plan-details-spinner"></div>
          <p>Loading journey...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="plan-details-page">
        <div className="container plan-details-auth-prompt">
          <p>{error || "Plan not found"}</p>
          <Link
            to="/my-plans"
            className="btn btn-primary btn-margin-top"
          >
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-details-page">
      <PlanDetailsHeader 
        plan={plan} 
        setShowDeleteModal={setShowDeleteModal} 
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handlePlanDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this trip plan? This action cannot be undone."
        confirmText="Delete Plan"
      />

      <main className="plan-details-main">
        <div className="container">
          {!plan.days || plan.days.length === 0 ? (
            <div className="plan-places-empty">
              <h3>Start Your Journey</h3>
              <p>This plan is empty. Edit it to add clear days and places.</p>
              <Link
                to={`/plan/edit/${plan._id}`}
                className="btn btn-primary btn-margin-top"
              >
                Start Planning
              </Link>
            </div>
          ) : (
            <PlanTimeline 
              plan={plan} 
              onDragEnd={onDragEnd} 
              handleDeleteDay={handleDeleteDay} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PlanDetails;
