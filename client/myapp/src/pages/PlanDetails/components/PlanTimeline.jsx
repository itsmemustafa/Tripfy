import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const PlanTimeline = ({ plan, onDragEnd, handleDeleteDay }) => {
  const navigate = useNavigate();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="plan-timeline">
        {(provided) => (
          <div
            className="plan-days-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {plan.days.map((day, index) => (
              <Draggable
                key={day._id || `day-${index}`}
                draggableId={day._id || `day-${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`plan-day-section ${snapshot.isDragging ? "is-dragging" : ""}`}
                    style={{ ...provided.draggableProps.style }}
                  >
                    <div className="plan-day-header">
                      {day.dayNumber || index + 1}
                    </div>

                    <div className="plan-day-card">
                      <div className="plan-day-card-header">
                        <h3 className="plan-day-card-title">
                          Day {day.dayNumber || index + 1}
                        </h3>
                        <p className="plan-day-card-date">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <button
                        className="btn-delete-day"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDay(index);
                        }}
                        title="Delete Day"
                      >
                        Delete
                      </button>

                      {!day.places || day.places.length === 0 ? (
                        <div className="plan-day-empty-state">
                          Running empty today? Add some spots!
                          <br />
                          <span className="plan-day-empty-desc">
                            Rest & Explore at your own pace.
                          </span>
                        </div>
                      ) : (
                        <div className="plan-days-places-grid">
                          {day.places.map((item, pIndex) => (
                            <div 
                              key={pIndex} 
                              className="roadmap-place-item"
                              onClick={() => {
                                if (item.place?._id) {
                                  navigate(`/place/${item.place._id}`);
                                }
                              }}
                              style={{ cursor: item.place?._id ? 'pointer' : 'default' }}
                            >
                              <img
                                src={
                                  item.place?.images?.[0] ||
                                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
                                }
                                alt={item.place?.name}
                                className="roadmap-place-img"
                              />
                              <div className="roadmap-place-info">
                                <h4>{item.place?.name || "Unknown Place"}</h4>
                                <p>
                                  {item.place?.category}
                                  {item.visitTime ? `  •  ${item.visitTime}` : ""}
                                </p>
                                {item.note && (
                                  <p className="roadmap-place-note">{item.note}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PlanTimeline;
