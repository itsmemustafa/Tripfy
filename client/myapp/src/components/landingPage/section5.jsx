import React from "react";
import "./landingPage.css";
import "./sections45.css";


const Section5 = () => {
  return (
    <section className="section map-section">
      <div className="container">
        <div className="map-section__wrapper">
          {/* Left Visual - Map Preview */}
          <div className="map-section__visual">
            <div className="map-preview-card">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                alt="Map Preview"
                className="map-preview-image"
              />
              <div className="map-pin pin-1">📍</div>
              <div className="map-pin pin-2">📍</div>
              <div className="map-pin pin-3">📍</div>

              <div className="map-card-overlay">
                <span>Explore Interactive Map</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="map-section__content">
            <span className="section-tag">Interactive Map</span>

            <h2 className="heading-2">
              Explore Iraq <br />
              <span className="text-gradient">Visually</span>
            </h2>

            <p className="section-description">
              Get a bird's eye view of all destinations. Filter by category,
              find places near you, and plan your route visually with our
              interactive map.
            </p>

            <div className="map-features">
              <div className="map-feature-item">
                View all attractions on one map
              </div>
              <div className="map-feature-item">
                Filter by Nature, History, Food
              </div>
              <div className="map-feature-item">Get directions instantly</div>
            </div>

            <a href="/map" className="btn btn-secondary btn-lg">
              Open Full Map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section5;
