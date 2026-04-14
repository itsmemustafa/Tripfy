import React from 'react';
import './PlaceHeader.css';
import { Link } from 'react-router-dom';

const PlaceHeader = ({ place }) => (
  <>
    <div className="place-details__breadcrumbs">
      <Link to="/">Home</Link>
      <span>/</span>
      <Link to="/places">Destinations</Link>
      <span>/</span>
      <span>{place.name}</span>
    </div>
    <header className="place-details__header">
      <div className="place-details__title-row">
        <h1 className="place-details__title">{place.name}</h1>
        <span className="place-details__rating">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {place.rating.toFixed(1)}
        </span>
      </div>
      <div className="place-details__meta">
        <span className="place-details__location">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {place.location.city}, Kurdistan
        </span>
        <span className="place-card__category" style={{ position: "static" }}>
          {place.category}
        </span>
      </div>
    </header>
  </>
);

export default PlaceHeader;
