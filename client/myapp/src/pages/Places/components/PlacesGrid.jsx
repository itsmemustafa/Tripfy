import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceCard from '../../../components/common/Card/Card';

const PlacesGrid = ({ places, loading, error, clearFilters }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="places__loading">
                <div className="places__spinner"></div>
                <p>Loading places...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="places__error">
                <p>{error}</p>
            </div>
        );
    }

    if (places.length === 0) {
        return (
            <div className="places__empty">
                <p>No places found matching your criteria.</p>
                <button
                    className="btn btn-primary places__clear-btn"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>
        );
    }

    return (
        <div className="cards-grid">
            {places.map(place => (
                <PlaceCard
                    key={place._id}
                    image={place.images?.[0]}
                    title={place.name}
                    location={place.location?.city || 'Iraq'}
                    rating={place.rating || 0}
                    description={place.description}
                    category={place.category}
                    onClick={() => navigate(`/place/${place._id}`)}
                />
            ))}
        </div>
    );
};

export default PlacesGrid;
