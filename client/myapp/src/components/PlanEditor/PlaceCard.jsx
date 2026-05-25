import React from 'react';
import { Draggable } from "@hello-pangea/dnd";
import './PlaceCard.css';

const PlaceCard = ({ placeItem, placeIndex, dayIndex, isViewOnly, updatePlaceNote }) => {
  return (
    <Draggable
      draggableId={`place-${dayIndex}-${placeIndex}`}
      index={placeIndex}
      isDragDisabled={isViewOnly}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`place-card ${snapshot.isDragging ? "dragging" : ""}`}
        >
          {!isViewOnly && (
            <div
              className="drag-handle"
              {...provided.dragHandleProps}
            >
              ⋮⋮
            </div>
          )}
          <div className="place-order-badge">
            {placeItem.order || placeIndex + 1}
          </div>
          <div className="place-details">
            <div className="place-header">
              <h4>
                {placeItem.place?.name || "Place"}
              </h4>
              {placeItem.visitTime && (
                <span className="visit-time-badge">
                  {placeItem.visitTime}
                </span>
              )}
            </div>
            {placeItem.place?.description && (
              <p className="place-description">
                {placeItem.place.description}
              </p>
            )}
            {isViewOnly ? (
              placeItem.note && (
                <div className="place-note-display">
                  {placeItem.note}
                </div>
              )
            ) : (
              <textarea
                className="place-note-input"
                placeholder="Add a note or tip..."
                value={placeItem.note || ""}
                onChange={(e) =>
                  updatePlaceNote(
                    dayIndex,
                    placeIndex,
                    e.target.value
                  )
                }
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default PlaceCard;
