import React from "react";
import { Link } from "react-router-dom";
import "./landingPage.css";
import "./section3.css";


const Section3 = () => {
  const plannerFeatures = [
    {
      title: "Local Hotspots",
      description: "Hidden gems & must-see places",
    },
    {
      title: "Time Efficient",
      description: "Make better use of your time",
    },
    {
      title: "Save & Share",
      description: "Export and share your plans",
    },
  ];

  return (
    <section className="section trip-planner-cta">
      {/* Background Elements */}
      <div className="trip-planner-cta__bg">
        <div className="trip-planner-cta__blob trip-planner-cta__blob--1"></div>
        <div className="trip-planner-cta__blob trip-planner-cta__blob--2"></div>
        <div className="trip-planner-cta__grid-pattern"></div>
      </div>

      <div className="container">
        <div className="trip-planner-cta__wrapper">
          {/* Left Content */}
          <div className="trip-planner-cta__content">
            <span className="trip-planner-cta__badge">New Feature</span>

            <h2 className="trip-planner-cta__title">
              Plan Your
              <span className="trip-planner-cta__title-highlight">
                {" "}
                Trip
              </span>
            </h2>

            <p className="trip-planner-cta__description">
              Build a day-by-day itinerary based on your destinations and
              preferences. Save your plan and update it any time.
            </p>

            {/* Feature Pills */}
            <div className="trip-planner-cta__features">
              {plannerFeatures.map((feature, index) => (
                <div key={index} className="trip-planner-cta__feature">
                  <div className="trip-planner-cta__feature-text">
                    <span className="trip-planner-cta__feature-title">
                      {feature.title}
                    </span>
                    <span className="trip-planner-cta__feature-desc">
                      {feature.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="trip-planner-cta__actions">
              <Link
                to="/plan"
                className="btn btn-primary btn-lg trip-planner-cta__btn-primary"
              >
                Start Planning
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="trip-planner-cta__visual">
            <div className="trip-planner-cta__card trip-planner-cta__card--main">
              <div className="trip-planner-cta__card-header">
                <div className="trip-planner-cta__card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="trip-planner-cta__card-title">My Trip</span>
              </div>
              <div className="trip-planner-cta__card-body">
                <div className="trip-planner-cta__timeline">
                  <div className="trip-planner-cta__timeline-item">
                    <div className="trip-planner-cta__timeline-marker"></div>
                    <div className="trip-planner-cta__timeline-content">
                      <span className="trip-planner-cta__timeline-day">
                        Day 1
                      </span>
                      <span className="trip-planner-cta__timeline-place">
                        Erbil Citadel
                      </span>
                    </div>
                  </div>
                  <div className="trip-planner-cta__timeline-item">
                    <div className="trip-planner-cta__timeline-marker"></div>
                    <div className="trip-planner-cta__timeline-content">
                      <span className="trip-planner-cta__timeline-day">
                        Day 2
                      </span>
                      <span className="trip-planner-cta__timeline-place">
                        Gali Ali Beg
                      </span>
                    </div>
                  </div>
                  <div className="trip-planner-cta__timeline-item">
                    <div className="trip-planner-cta__timeline-marker"></div>
                    <div className="trip-planner-cta__timeline-content">
                      <span className="trip-planner-cta__timeline-day">
                        Day 3
                      </span>
                      <span className="trip-planner-cta__timeline-place">
                        Shanidar Cave
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="trip-planner-cta__float trip-planner-cta__float--1">
              <span>+12 Places</span>
            </div>
            <div className="trip-planner-cta__float trip-planner-cta__float--2">
              <span>4.9 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section3;
