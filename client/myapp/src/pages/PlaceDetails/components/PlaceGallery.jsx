import React, { useState } from 'react';
import './PlaceGallery.css';

const PlaceGallery = ({ place }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const images = place?.images && place.images.length > 0
    ? place.images
    : [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
      ];

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (distance < -50 && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) setCurrentImageIndex(prev => prev + 1);
  };
  const prevImage = () => {
    if (currentImageIndex > 0) setCurrentImageIndex(prev => prev - 1);
  };

  return (
    <div className="place-details__gallery">
      <div
        className="place-details__gallery-mobile"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="place-details__carousel-track"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <img key={index} src={img} alt={`${place?.name} view ${index + 1}`} className="place-details__carousel-image" />
          ))}
        </div>

        {currentImageIndex > 0 && (
          <button className="place-details__carousel-btn place-details__carousel-btn--prev" onClick={prevImage} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {currentImageIndex < images.length - 1 && (
          <button className="place-details__carousel-btn place-details__carousel-btn--next" onClick={nextImage} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
        <div className="place-details__carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`place-details__carousel-dot ${index === currentImageIndex ? 'is-active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <img src={images[0]} alt={place?.name} className="place-details__image-main" />
      <div className="place-details__gallery-side">
        <img src={images[1]} alt={`${place?.name} view 2`} className="place-details__image-side" />
        <img src={images[2] || images[1]} alt={`${place?.name} view 3`} className="place-details__image-side" />
      </div>
    </div>
  );
};

export default PlaceGallery;
