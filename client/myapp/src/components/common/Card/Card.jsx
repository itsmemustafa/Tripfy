import React from "react";
import "./Card.css";


const PlaceCard = ({
  image,
  title,
  location,
  rating,
  description,
  category,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
}) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle?.();
  };

  // Default placeholder image if none provided 
  const displayImage =
    image ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";

  // Category color mapping
  const getCategoryColor = (cat) => {
    const colors = {
      "Natural Attraction": { bg: "rgba(34, 197, 94, 0.15)", text: "#16a34a" },
      "Historical Site": { bg: "rgba(168, 85, 247, 0.15)", text: "#9333ea" },
      Restaurant: { bg: "rgba(249, 115, 22, 0.15)", text: "#ea580c" },
      Cafe: { bg: "rgba(236, 72, 153, 0.15)", text: "#db2777" },
      Adventure: { bg: "rgba(14, 165, 233, 0.15)", text: "#0284c7" },
    };
    return colors[cat] || { bg: "rgba(107, 114, 128, 0.15)", text: "#4b5563" };
  };

  const categoryStyle = getCategoryColor(category);

  return (
    <article className="place-card" onClick={onClick}>
      {/* Image Container */}
      <div className="place-card__image-container">
        <img
          src={displayImage}
          alt={title}
          className="place-card__image"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";
          }}
        />

        {/* Category Badge */}
        {category && (
          <span
            className="place-card__category"
            style={{
              background: categoryStyle.bg,
              color: categoryStyle.text,
              backdropFilter: "blur(8px)",
            }}
          >
            {category}
          </span>
        )}

        {/* Image Overlay Gradient */}
        <div className="place-card__overlay"></div>
      </div>

      {/* Card Content */}
      <div className="place-card__content">
        {/* Title & Rating Row */}
        <div className="place-card__header">
          <h3 className="place-card__title">{title}</h3>
          {rating > 0 && (
            <div className="place-card__rating">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{rating.toFixed(1)}</span>
              {/* Google Logo */}
              <svg
                className="place-card__rating-google"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="place-card__location">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{location}</span>
        </div>

        {/* Description (if available) */}
        {description && (
          <p className="place-card__description">{description}</p>
        )}

        {/* Footer: View Details CTA */}
        <div className="place-card__footer">
          <button className="place-card__cta">
            Explore
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;
