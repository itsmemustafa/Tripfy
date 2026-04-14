import React from 'react';
import PlacesSidebar from './components/PlacesSidebar';
import PlacesGrid from './components/PlacesGrid';
import { usePlaces } from './hooks/usePlaces';
import './Places.css';

const Places = () => {
    const {
        places, loading, error, metadata, filters,
        handleFilterChange, handlePageChange, clearFilters
    } = usePlaces();

    return (
        <div className="places-page">
            <div className="places__container">
                <div className="places__header">
                    <h1 className="places__title">Explore Kurdistan</h1>
                    <p className="places__subtitle">
                        Discover hidden gems, historical landmarks, and breathtaking nature in the heart of Kurdistan.
                    </p>
                </div>

                <div className="places__layout">
                    <PlacesSidebar 
                        filters={filters} 
                        handleFilterChange={handleFilterChange} 
                    />

                    <div className="places__results">
                        <div className="places__controls">
                            <span className="places__count">
                                Showing {places.length} of {metadata.total} places
                            </span>
                            <select
                                className="places__sort"
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="-rating">Top Rated</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>

                        <PlacesGrid 
                            places={places}
                            loading={loading}
                            error={error}
                            clearFilters={clearFilters}
                        />

                        {!loading && !error && places.length > 0 && metadata.totalPages > 1 && (
                            <div className="places__pagination">
                                <button
                                    className="pagination-btn"
                                    disabled={metadata.page === 1}
                                    onClick={() => handlePageChange(metadata.page - 1)}
                                >
                                    Prev
                                </button>
                                {Array.from({ length: metadata.totalPages }).map((_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`pagination-btn ${metadata.page === i + 1 ? 'is-active' : ''}`}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="pagination-btn"
                                    disabled={metadata.page === metadata.totalPages}
                                    onClick={() => handlePageChange(metadata.page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Places;
