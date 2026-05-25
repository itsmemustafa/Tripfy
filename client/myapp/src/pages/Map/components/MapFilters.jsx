import React from 'react';
import './MapFilters.css';

const CATEGORIES = ['Nature', 'Historical', 'Restaurant', 'Cafe', 'Adventure', 'Religious'];
const CITIES = ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Sulaymaniyah', 'Duhok', 'Halabja', 'Zakho'];

const MapFilters = ({
    filtersOpen,
    setFiltersOpen,
    filters,
    handleFilterChange,
    handleClearFilters,
    placesCount,
    allPlacesCount
}) => {
    const hasActiveFilters = filters.search || filters.category || filters.city;

    return (
        <>
            <button
                className="map-filter-toggle"
                onClick={() => setFiltersOpen(!filtersOpen)}
                title="Toggle filters"


            >
                {/*filter icon */}

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {hasActiveFilters && <span className="map-filter-badge"></span>}
            </button>

            <div className={`map-filters-panel ${filtersOpen ? 'is-open' : ''}`}>
                <div className="map-filters-header">
                    <h3>Filter Places</h3>
                    <button
                        className="map-filters-close"
                        onClick={() => setFiltersOpen(false)}
                        aria-label="Close filters"
                    >
                        Close
                    </button>
                </div>

                <div className="map-filters-content">
                    <div className="map-filter-group">
                        <label className="map-filter-label">Search</label>
                        <div className="map-filter-search">
                            <svg className="map-filter-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                className="map-filter-input"
                                placeholder="Search places..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="map-filter-group">
                        <label className="map-filter-label">Category</label>
                        <select
                            className="map-filter-select"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="map-filter-group">
                        <label className="map-filter-label">City</label>
                        <select
                            className="map-filter-select"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                        >
                            <option value="">All Cities</option>
                            {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            className="map-filter-clear"
                            onClick={handleClearFilters}
                        >
                            Clear All Filters
                        </button>
                    )}

                    <div className="map-filter-results">
                        Showing {placesCount} of {allPlacesCount} places
                    </div>
                </div>
            </div>
        </>
    );
};

export default MapFilters;
