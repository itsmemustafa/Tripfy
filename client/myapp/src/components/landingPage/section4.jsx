import React from "react";
import "./landingPage.css";
import "./sections45.css";


const Section4 = () => {
  return (
    <section className="section ai-section">
      <div className="container">
        <div className="ai-section__wrapper">
          {/* Left Content */}
          <div className="ai-section__content">
            <span className="section-tag">Planner Assistant</span>

            <h2 className="heading-2">
              Your Personal <br />
              <span className="text-gradient">Trip Assistant</span>
            </h2>

            <p className="section-description">
              Tell us what you want to do and get a day-by-day itinerary for
              your trip.
            </p>

            <div className="ai-features">
              <div className="ai-feature">
                <div>
                  <strong>Custom Itineraries</strong>
                  <p>Based on your preferences</p>
                </div>
              </div>
              <div className="ai-feature">
                <div>
                  <strong>Quick Results</strong>
                  <p>Generate a plan fast</p>
                </div>
              </div>
            </div>

            <a href="/ai-planner" className="btn btn-primary btn-lg">
              Open Planner Assistant
            </a>
          </div>

          {/* Right Visual - Chat UI Mockup */}
          <div className="ai-section__visual">
            <div className="chat-mockup">
              <div className="chat-mockup__header">
                <div className="chat-mockup__avatar">Assistant</div>
                <div>
                  <span className="chat-mockup__name">Tripfy Planner</span>
                  <span className="chat-mockup__status">Online</span>
                </div>
              </div>
              <div className="chat-mockup__body">
                <div className="chat-message ai">
                  <p>Hello! Where would you like to go in Kurdistan?</p>
                </div>
                <div className="chat-message user">
                  <p>
                    I want a 3-day trip to Erbil focusing on history and food.
                  </p>
                </div>
                <div className="chat-message ai">
                  <p>
                    Here is a 3-day plan for Erbil with historical spots and
                    food options.
                  </p>
                  <div className="mock-plan-preview">
                    <span>Erbil Citadel</span>
                    <span>kebabs at Sami Abdulrahman...</span>
                  </div>
                </div>
              </div>
              <div className="chat-mockup__input">
                <span>Type your message...</span>
                <button>↑</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section4;
