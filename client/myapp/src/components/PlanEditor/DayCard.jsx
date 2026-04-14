import React from 'react';
import { Droppable, Draggable } from "@hello-pangea/dnd";
import PlaceCard from './PlaceCard';
import './DayCard.css';
import { formatDate } from './utils';

const DayCard = ({
  day,
  dayIndex,
  isViewOnly,
  expandedDays,
  toggleDay,
  duplicateDay,
  deleteDay,
  canDelete,
  updatePlaceNote
}) => {
  const isExpanded = expandedDays.has(dayIndex);

  return (
    <Draggable
      draggableId={`day-${dayIndex}`}
      index={dayIndex}
      isDragDisabled={isViewOnly}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`day-card ${isExpanded ? "expanded" : ""} ${snapshot.isDragging ? "dragging" : ""}`}
        >
          <div className="day-card-header">
            {!isViewOnly && (
              <div
                className="drag-handle"
                {...provided.dragHandleProps}
              >
                ⋮⋮
              </div>
            )}
            <div
              className="day-info"
              onClick={() => toggleDay(dayIndex)}
            >
              <h3>Day {day.dayNumber}</h3>
              <p className="day-date">{formatDate(day.date)}</p>
              <span className="places-count">
                {day.places?.length || 0}{" "}
                {day.places?.length === 1 ? "place" : "places"}
              </span>
            </div>
            {!isViewOnly && (
              <div className="day-actions">
                <button
                  className="icon-btn"
                  onClick={() => duplicateDay(dayIndex)}
                  title="Duplicate day"
                >
                  Duplicate
                </button>
                <button
                  className="icon-btn"
                  onClick={() => deleteDay(dayIndex)}
                  title="Delete day"
                  disabled={!canDelete}
                >
                  Delete
                </button>
                <button
                  className="icon-btn expand-btn"
                  onClick={() => toggleDay(dayIndex)}
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </button>
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="day-card-content">
              <Droppable
                droppableId={`day-${dayIndex}`}
                type="PLACE"
              >
                {(provided) => (
                  <div
                    className="places-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {day.places?.map((placeItem, placeIndex) => (
                      <PlaceCard 
                        key={`place-${dayIndex}-${placeIndex}`}
                        placeItem={placeItem}
                        placeIndex={placeIndex}
                        dayIndex={dayIndex}
                        isViewOnly={isViewOnly}
                        updatePlaceNote={updatePlaceNote}
                      />
                    ))}
                    {provided.placeholder}
                    {day.places?.length === 0 && (
                      <div className="no-places-message">
                        No places added yet
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default DayCard;
