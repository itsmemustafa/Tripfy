import React from "react";
import { useParams, Link } from "react-router-dom";
import ReviewList from "../../components/reviews/ReviewList";
import ReviewForm from "../../components/reviews/ReviewForm";
import AddToItineraryModal from "../../components/modals/AddToItineraryModal";
import WeatherWidget from "../../components/weather/WeatherWidget";
import { useAuth } from "../../context/AuthContext";

import { usePlaceDetails } from "./hooks/usePlaceDetails";
import { useItinerary } from "./hooks/useItinerary";

import PlaceGallery from "./components/PlaceGallery";
import PlaceHeader from "./components/PlaceHeader";
import PlaceMap from "./components/PlaceMap";

import "./PlaceDetails.css";
import "../../components/reviews/reviews.css";

const PlaceDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const {
    place, reviews, loading, error, submittingReview,
    hasMoreReviews, loadingMoreReviews, totalReviews,
    handleReviewSubmit, loadMoreReviews
  } = usePlaceDetails(id, isAuthenticated, user);

  const {
    showItineraryModal, setShowItineraryModal,
    userPlans, loadingPlans, handleAddToItinerary, handleAddPlaceToPlan
  } = useItinerary(id, place?.name, isAuthenticated, openAuthModal);

  const handleGoogleMapsClick = () => {
    if (place?.location?.coordinates) {
      const { lat, lng } = place.location.coordinates;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div className="place-details__loading">
        <div className="places__spinner"></div>
        <p>Loading place details...</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="place-details">
        <div
          className="container"
          style={{ textAlign: "center", paddingTop: "100px" }}
        >
          <h2>{error || "Place not found"}</h2>
          <Link
            to="/places"
            className="btn btn-primary"
            style={{ marginTop: "20px" }}
          >
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="place-details">
      <div className="place-details__container">

        <PlaceHeader place={place} />

        <PlaceGallery place={place} />

        {/* ── Mobile-only: Quick Actions Bar ── */}
        <div className="place-details__actions-bar">
          <button className="btn btn-primary" onClick={handleAddToItinerary}>
            Add to Itinerary
          </button>
          <button className="btn btn-secondary" onClick={handleGoogleMapsClick}>
            Directions
          </button>
        </div>

        <div className="place-details__content">
          <div className="place-details__main">
            <h2 className="place-details__section-title">About this place</h2>
            <p className="place-details__description">
              {place.description ||
                "A destination in Iraq with history and local attractions."}
            </p>

            {/* ── Mobile-only: Inline Weather ── */}
            <div className="place-details__weather-inline">
              <WeatherWidget placeId={id} />
            </div>

            <PlaceMap place={place} />

            {/* Reviews Section */}
            <div id="reviews" className="reviews-container">
              <h2 className="place-details__section-title">
                Reviews ({reviews.length})
              </h2>

              {isAuthenticated ? (
                <ReviewForm
                  onSubmit={handleReviewSubmit}
                  isSubmitting={submittingReview}
                />
              ) : (
                <div className="login-to-review">
                  <p>
                    Please{" "}
                    <button
                      className="btn-link"
                      onClick={() => openAuthModal("login")}
                    >
                      log in
                    </button>{" "}
                    to leave a review.
                  </p>
                </div>
              )}

              <ReviewList reviews={reviews} />

              {hasMoreReviews && (
                <div className="reviews-load-more-container">
                  <button
                    className="btn btn-secondary"
                    onClick={loadMoreReviews}
                    disabled={loadingMoreReviews}
                    style={{ padding: '0.6rem 2rem', fontSize: '0.9rem' }}
                  >
                    {loadingMoreReviews ? 'Loading...' : `Load More Reviews (${reviews.length} of ${totalReviews})`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="place-details__sidebar">
            <div className="place-details__info-card">
              <WeatherWidget placeId={id} />

              <div className="place-details__actions" style={{ marginTop: '2rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={handleAddToItinerary}
                >
                  Add to Itinerary
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={handleGoogleMapsClick}
                >
                  Get Directions
                </button>
              </div>
            </div>
          </aside>
        </div>

        <AddToItineraryModal
          isOpen={showItineraryModal}
          onClose={() => setShowItineraryModal(false)}
          plans={userPlans}
          onAddToPlan={handleAddPlaceToPlan}
          placeName={place?.name}
          loading={loadingPlans}
        />
      </div>
    </div>
  );
};

export default PlaceDetails;
