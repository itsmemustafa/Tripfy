import React from 'react';
import './LocationControl.css';

const LocationControl = ({ isLocating, handleGetLocation, locationError, clearLocationError }) => {
    return (
        <>
            <button
                className="map-location-button"
                onClick={handleGetLocation}
                disabled={isLocating}
            >
                {isLocating ? (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" className="map-location-spinner" />
                        </svg>
                        <span>Locating...</span>
                    </>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                        </svg>
                        <span>Find My Location</span>
                    </>
                )}
            </button>

            {locationError && (
                <div className="map-location-error">
                    <p>{locationError}</p>
                    <button onClick={clearLocationError}>Close</button>
                </div>
            )}
        </>
    );
};

export default LocationControl;
