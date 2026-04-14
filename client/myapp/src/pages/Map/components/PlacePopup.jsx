import React from 'react';
import { Popup } from 'react-map-gl/maplibre';
import './PlacePopup.css';
import { useNavigate } from 'react-router-dom';

const PlacePopup = ({ place, onClose }) => {
    const navigate = useNavigate();

    return (
        <Popup
            longitude={place.location.coordinates.lng}
            latitude={place.location.coordinates.lat}
            anchor="bottom"
            onClose={onClose}
            closeButton={true}
            closeOnClick={false}
        >
            <div className="map-popup">
                {place.images?.[0] && (
                    <img
                        src={place.images[0]}
                        alt={place.name}
                        className="map-popup-image"
                    />
                )}
                <h3 className="map-popup-title">{place.name}</h3>
                <button
                    className="map-popup-button"
                    onClick={() => navigate(`/place/${place._id}`)}
                >
                    View Details
                </button>
            </div>
        </Popup>
    );
};

export default PlacePopup;
