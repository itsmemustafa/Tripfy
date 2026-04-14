import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePlanData } from "./hooks/usePlanData";

import PlanForm from "./components/PlanForm";
import PlanDestinations from "./components/PlanDestinations";

import "./Plan.css";

const Plan = () => {
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(editId);

  const {
    activeDay, setActiveDay, dayPlaces, places, loading, loadingPlan,
    submitting, message, tripDetails, currentPage, totalPages,
    togglePlaceSelection, getAssignedDay, handleInputChange, handleSubmit, handlePageChange
  } = usePlanData(editId, user, navigate);

  if (loadingPlan) {
    return (
      <div className="plan-page">
        <div className="plan-loading plan-loading-large">
          <div className="plan-spinner"></div>
          <p>Loading plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-page">
      <main className="plan-main">
        <div className="container">
          <div className="plan-back-link">
            <Link
              to={isEditMode ? `/my-plans/${editId}` : "/"}
              className="btn btn-secondary plan-back-btn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="plan-back-icon"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {isEditMode ? "Back to Plan" : "Back to Home"}
            </Link>
          </div>

          <div className="plan-layout">
            <PlanForm 
              tripDetails={tripDetails}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              submitting={submitting}
              message={message}
              user={user}
              isEditMode={isEditMode}
              dayPlaces={dayPlaces}
            />

            <PlanDestinations 
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              duration={tripDetails.duration}
              dayPlaces={dayPlaces}
              loading={loading}
              places={places}
              togglePlaceSelection={togglePlaceSelection}
              getAssignedDay={getAssignedDay}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Plan;
