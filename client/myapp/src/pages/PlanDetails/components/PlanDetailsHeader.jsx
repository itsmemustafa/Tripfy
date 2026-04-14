import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SharePlanModal from '../../../components/SharePlan/SharePlanModal';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PlanDetailsHeader = ({ plan, setShowDeleteModal }) => {
  const [showShare, setShowShare] = useState(false);

  return (
    <header className="plan-details-header">
      <div className="container">
        <Link to="/my-plans" className="plan-details-header__back">
          Back to My Trips
        </Link>

        <h1 className="plan-details-header__title">{plan.planTitle}</h1>

        <div className="plan-details-header__meta">
          <div className="plan-details-header__meta-item">{plan.city}</div>
          <div className="plan-details-header__meta-item">
            {formatDate(plan.startDate)}
          </div>
          <div className="plan-details-header__meta-item">
            {plan.duration} Days
          </div>
        </div>

        <div className="plan-details-header__actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowShare(true)}
            title="Share this plan"
          >
            Share Plan
          </button>
          <Link to={`/plan/edit/${plan._id}`} className="btn btn-primary">
            Edit Details
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Trip
          </button>
        </div>
      </div>

      {showShare && (
        <SharePlanModal
          planId={plan._id}
          planTitle={plan.planTitle}
          onClose={() => setShowShare(false)}
        />
      )}
    </header>
  );
};

export default PlanDetailsHeader;
