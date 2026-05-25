import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import './PlaceMarker.css';

const PlaceMarker = ({ place, onClick }) => {
    if (!place.location?.coordinates?.lat || !place.location?.coordinates?.lng) {
        return null;
    }

    return (
        <Marker
            longitude={Number(place.location.coordinates.lng)}
            latitude={Number(place.location.coordinates.lat)}
            anchor="bottom"
            onClick={(e) => {
                e.originalEvent.stopPropagation();
                onClick(place);
            }}
        >
            <div className="map-marker">
                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="var(--color-primary)"
                    stroke="white"
                    strokeWidth="2"
                >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3" fill="white"></circle>
                </svg>
            </div>
        </Marker>
    );
};

export default PlaceMarker;
