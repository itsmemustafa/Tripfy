import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import PlanEditorHeader from "./PlanEditorHeader";
import TimelineProgress from "./TimelineProgress";
import DayCard from "./DayCard";
import { getPlanTypeColor } from "./utils";
import "./PlanEditor.css";


const PlanEditor = ({ initialPlan, onSave, onCancel, isViewOnly = false }) => {
  const [plan, setPlan] = useState(initialPlan);
  const [expandedDays, setExpandedDays] = useState(new Set([0]));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  const toggleDay = (dayIndex) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDays(newExpanded);
  };

  const reorderDays = (sourceIndex, destinationIndex) => {
    const newDays = Array.from(plan.days);
    const [removed] = newDays.splice(sourceIndex, 1);
    newDays.splice(destinationIndex, 0, removed);

    newDays.forEach((day, index) => {
      day.dayNumber = index + 1;
    });

    setPlan({ ...plan, days: newDays });
  };

  const reorderPlaces = (source, destination) => {
    const dayIndex = parseInt(source.droppableId.split("-")[1]);
    const newDays = Array.from(plan.days);
    const places = Array.from(newDays[dayIndex].places);

    const [removed] = places.splice(source.index, 1);
    places.splice(destination.index, 0, removed);

    places.forEach((place, index) => {
      place.order = index + 1;
    });

    newDays[dayIndex].places = places;
    setPlan({ ...plan, days: newDays });
  };

  const handleDragEnd = (result) => {
    if (!result.destination || isViewOnly) return;

    const { source, destination, type } = result;

    if (type === "DAY") {
      reorderDays(source.index, destination.index);
    } else if (type === "PLACE") {
      reorderPlaces(source, destination);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(plan);
    } finally {
      setIsSaving(false);
    }
  };

  const duplicateDay = (dayIndex) => {
    if (isViewOnly) return;
    const newDays = Array.from(plan.days);
    const dayToDuplicate = { ...newDays[dayIndex] };
    dayToDuplicate.places = dayToDuplicate.places.map((p) => ({ ...p }));
    newDays.splice(dayIndex + 1, 0, dayToDuplicate);

    newDays.forEach((day, index) => {
      day.dayNumber = index + 1;
      const newDate = new Date(plan.startDate);
      newDate.setDate(newDate.getDate() + index);
      day.date = newDate.toISOString();
    });

    setPlan({ ...plan, days: newDays, duration: newDays.length });
  };

  const deleteDay = (dayIndex) => {
    if (isViewOnly || plan.days.length <= 1) return;
    const newDays = plan.days.filter((_, index) => index !== dayIndex);

    newDays.forEach((day, index) => {
      day.dayNumber = index + 1;
    });

    setPlan({ ...plan, days: newDays, duration: newDays.length });
  };

  const addNewDay = () => {
    if (isViewOnly) return;
    const newDays = Array.from(plan.days);
    const newDate = new Date(plan.startDate);
    newDate.setDate(newDate.getDate() + newDays.length);

    newDays.push({
      dayNumber: newDays.length + 1,
      date: newDate.toISOString(),
      places: [],
    });

    setPlan({ ...plan, days: newDays, duration: newDays.length });
  };

  const updatePlanField = (field, value) => {
    if (isViewOnly) return;
    setPlan({ ...plan, [field]: value });
  };

  const updatePlaceNote = (dayIndex, placeIndex, note) => {
    if (isViewOnly) return;
    const newDays = Array.from(plan.days);
    newDays[dayIndex].places[placeIndex].note = note;
    setPlan({ ...plan, days: newDays });
  };

  const planColor = getPlanTypeColor(plan.planType);

  return (
    <div className="plan-editor">
      <PlanEditorHeader
        plan={plan}
        isViewOnly={isViewOnly}
        updatePlanField={updatePlanField}
      />

      <TimelineProgress
        days={plan.days}
        expandedDays={expandedDays}
        toggleDay={toggleDay}
      />

      <div className="plan-editor-content">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="days" type="DAY">
            {(provided) => (
              <div
                className="days-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {plan.days?.map((day, dayIndex) => (
                  <DayCard
                    key={`day-${dayIndex}`}
                    day={day}
                    dayIndex={dayIndex}
                    isViewOnly={isViewOnly}
                    expandedDays={expandedDays}
                    toggleDay={toggleDay}
                    duplicateDay={duplicateDay}
                    deleteDay={deleteDay}
                    canDelete={plan.days?.length > 1}
                    updatePlaceNote={updatePlaceNote}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!isViewOnly && (
          <button className="add-day-btn" onClick={addNewDay}>
            + Add New Day
          </button>
        )}
      </div>

      {!isViewOnly && (
        <div className="plan-editor-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
            style={{ background: planColor }}
          >
            {isSaving ? "Saving..." : "Save Plan"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanEditor;
