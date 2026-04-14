import React, { useState } from "react";
import "./PlanPreviewModal.css";
import PlanPreviewHeader from './components/PlanPreviewHeader';
import PlanPreviewTimeline from './components/PlanPreviewTimeline';
import PlanPreviewDayDetails from './components/PlanPreviewDayDetails';
import PlanPreviewActions from './components/PlanPreviewActions';


const PlanPreviewModal = ({
  planData,
  onAccept,
  onRegenerate,
  onClose,
  isLoading,
}) => {
  const [activeDay, setActiveDay] = useState(0);

  if (!planData) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanTypeColor = (type) => {
    const colors = {
      leisure: "#3b82f6",
      adventure: "#f97316",
      family: "#8b5cf6",
      solo: "#06b6d4",
      romantic: "#ec4899",
      business: "#64748b",
    };
    return colors[type] || colors.leisure;
  };

  return (
    <div className="plan-preview-overlay" onClick={onClose}>
      <div className="plan-preview-modal" onClick={(e) => e.stopPropagation()}>
        <PlanPreviewHeader planData={planData} getPlanTypeColor={getPlanTypeColor} onClose={onClose} />

        {/* Content */}
        <div className="plan-preview-content">
          <PlanPreviewTimeline
            planData={planData}
            getPlanTypeColor={getPlanTypeColor}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            formatDate={formatDate}
          />
          <PlanPreviewDayDetails
            planData={planData}
            activeDay={activeDay}
            formatDate={formatDate}
          />
        </div>

        <PlanPreviewActions
          planData={planData}
          getPlanTypeColor={getPlanTypeColor}
          onRegenerate={onRegenerate}
          onAccept={onAccept}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PlanPreviewModal;
