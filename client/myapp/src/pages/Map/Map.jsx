import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';

import { useMapPlaces } from './hooks/useMapPlaces';
import { useGeolocation } from './hooks/useGeolocation';

import MapFilters from './components/MapFilters';
import LocationControl from './components/LocationControl';
import PlaceMarker from './components/PlaceMarker';
import PlacePopup from './components/PlacePopup';

const MapPage = () => {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({ search: '', category: '', city: '' });
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: 44.0,
        latitude: 36.0,
        zoom: 7
    });

    const { allPlaces, places, loading, error } = useMapPlaces(filters, debouncedSearch);

    const handleLocationSuccess = ({ latitude, longitude }) => {
        setViewState(prev => ({
            ...prev,
            longitude,
            latitude,
            zoom: 12
        }));
    };

    const geolocation = useGeolocation(handleLocationSuccess);
    const { userLocation } = geolocation;

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
    const handleClearFilters = () => setFilters({ search: '', category: '', city: '' });

    // Debounce effect
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    if (loading) {
        return (
            <div className="map-loading">
                <div className="map-spinner"></div>
                <p>Loading map...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="map-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="map-page map-container-full">
            <MapFilters
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleClearFilters={handleClearFilters}
                placesCount={places.length}
                allPlacesCount={allPlaces.length}
            />

            <LocationControl {...geolocation} />

            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                style={{ width: '100%', height: '100%' }}
                className="map-gl-container"
                reuseMaps
            >
                {places.map(place => (
                    <PlaceMarker
                        key={place._id}
                        place={place}
                        onClick={setSelectedPlace}
                    />
                ))}

                {userLocation && (
                    <Marker
                        key="user-location"
                        longitude={userLocation.longitude}
                        latitude={userLocation.latitude}
                        anchor="center"
                    >
                        <div className="map-user-marker">
                            <div className="map-user-marker-pulse"></div>
                            <div className="map-user-marker-dot"></div>
                        </div>
                    </Marker>
                )}

                {selectedPlace && (
                    <PlacePopup
                        place={selectedPlace}
                        onClose={() => setSelectedPlace(null)}
                    />
                )}
            </Map>
        </div>
    );
};

export default MapPage;
