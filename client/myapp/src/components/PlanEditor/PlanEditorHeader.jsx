import React from 'react';
import { getPlanTypeColor } from './utils';
import './PlanEditorHeader.css';

const PlanEditorHeader = ({ plan, isViewOnly, updatePlanField }) => {
  return (
    <div
      className="plan-editor-header"
      style={{
        background: `linear-gradient(135deg, ${getPlanTypeColor(plan.planType)}, ${getPlanTypeColor(plan.planType)}dd)`,
      }}
    >
      {isViewOnly && (
        <div className="view-only-badge">
          <span>View Only</span>
        </div>
      )}
      <div className="plan-editor-title">
        {isViewOnly ? (
          <h1>{plan.planTitle}</h1>
        ) : (
          <input
            type="text"
            value={plan.planTitle}
            onChange={(e) => updatePlanField("planTitle", e.target.value)}
            className="title-input"
            placeholder="Plan Title"
          />
        )}
        <div className="plan-meta-badges">
          <span className="badge">{plan.planType}</span>
          <span className="badge">{plan.city}</span>
          <span className="badge">{plan.duration} Days</span>
          {plan.budget?.amount && (
            <span className="badge">
              {plan.budget.amount} {plan.budget.currency}
            </span>
          )}
          <span className={`badge badge-status ${plan.status}`}>
            {plan.status === "draft" ? "Draft" : "Published"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlanEditorHeader;
