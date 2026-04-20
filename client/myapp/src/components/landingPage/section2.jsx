import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import PlaceCard from "../common/Card/Card";
import { env } from "../../config/env.js";
import "./landingPage.css";
import "./section2.css";


const Section2 = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  // Fetch places from backend
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        // Fetch more places to ensure enough content for scrolling
        const response = await fetch(
          `${env.api.endpoints.places}?limit=10&sort=-rating`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }

        const data = await response.json();
        setPlaces(data.places || []);
      } catch (err) {
        console.error("Error fetching places:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Auto-scroll animation
  useEffect(() => {
    const slider = sliderRef.current;
    let animationFrameId;

    // Settings
    const speed = 0.5;

    const animate = () => {
      if (!slider) return;

      slider.scrollLeft += speed;

      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (places.length > 0 && !loading) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [places, loading]);

  return (
    <section id="destinations" className="section destinations">
      <div
        className="container-fluid"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {/* Section Header */}
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Start your trip</span>
            <h2 className="heading-2">
              Popular <span className="text-gradient">Destinations</span>
            </h2>
            <p className="section-description">
              Browse popular destinations across Iraq
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="destinations__loading">
            <div className="destinations__spinner"></div>
            <p>Loading destinations...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="destinations__error">
            <p>Unable to load destinations. Please try again later.</p>
          </div>
        )}

        {/* Places Slider */}
        {!loading && !error && places.length > 0 && (
          <div className="destinations__slider-container">
            <div className="destinations__slider-track" ref={sliderRef}>
              {/* Original Set */}
              {places.map((place, index) => (
                <div
                  key={`org-${place._id}-${index}`}
                  className="destinations__slide"
                >
                  <PlaceCard
                    image={place.images?.[0]}
                    title={place.name}
                    location={place.location?.city || "Iraq"}
                    rating={place.rating || 0}
                    description={place.description}
                    category={place.category}
                    onClick={() => navigate(`/place/${place._id}`)}
                  />
                </div>
              ))}
              {/* Duplicate Set for Infinite Loop */}
              {places.map((place, index) => (
                <div
                  key={`dup-${place._id}-${index}`}
                  className="destinations__slide"
                >
                  <PlaceCard
                    image={place.images?.[0]}
                    title={place.name}
                    location={place.location?.city || "Iraq"}
                    rating={place.rating || 0}
                    description={place.description}
                    category={place.category}
                    onClick={() => navigate(`/place/${place._id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        {!loading && places.length > 0 && (
          <div className="container">
            <div className="destinations__cta">
              <Link to="/places" className="btn btn-secondary btn-lg">
                View All Destinations
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Section2;
