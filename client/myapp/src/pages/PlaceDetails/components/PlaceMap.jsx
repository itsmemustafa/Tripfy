import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const PlaceMap = ({ place }) => {
  const coordinates = place?.location?.coordinates
    ? {
        latitude: place.location.coordinates.lat,
        longitude: place.location.coordinates.lng,
      }
    : { latitude: 36.19, longitude: 44.01 };
  
  const [viewState, setViewState] = useState({
    longitude: coordinates.longitude,
    latitude: coordinates.latitude,
    zoom: 13,
  });

  useEffect(() => {
    if (place?.location?.coordinates) {
      setViewState({
        longitude: place.location.coordinates.lng,
        latitude: place.location.coordinates.lat,
        zoom: 13,
      });
    }
  }, [place]);

  const handleGoogleMapsClick = () => {
    if (place?.location?.coordinates) {
      const { lat, lng } = place.location.coordinates;
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    }
  };

  return (
    <>
      <h2 className="place-details__section-title">Location</h2>
      <div className="place-details__map-container">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          style={{ height: "100%", width: "100%" }}
          scrollZoom={false}
        >
          <Marker
            longitude={coordinates.longitude}
            latitude={coordinates.latitude}
            anchor="bottom"
            onClick={handleGoogleMapsClick}
          >
            <div className="place-details__map-marker">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          <Popup
            longitude={coordinates.longitude}
            latitude={coordinates.latitude}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
          >
            <div>
              <b>{place.name}</b>
              <br />
              Click marker to open in Google Maps
            </div>
          </Popup>
        </Map>
        <div className="place-details__map-overlay">
          <button className="btn btn-secondary" onClick={handleGoogleMapsClick}>
            Open in Google Maps
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: '8px'}}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaceMap;
