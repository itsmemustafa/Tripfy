import React from 'react';

const CATEGORIES = ['Nature', 'Historical', 'Restaurant', 'Cafe', 'Adventure', 'Religious'];
const LOCATIONS = ['Baghdad', 'Erbil', 'Basra', 'Mosul', 'Sulaymaniyah', 'Duhok'];

const PlacesSidebar = ({ filters, handleFilterChange }) => (
    <aside className="places__filters">
        <div className="filter-group filter-group--search">
            <label className="filter-label">Search</label>
            <div className="places__search">
                <svg className="places__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="places__search-input"
                    placeholder="Search places..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                />
            </div>
        </div>

        <div className="filter-group">
            <label className="filter-label">Location</label>
            <div className="filter-options-scroll">
                <label className={`filter-chip ${filters.location === '' ? 'is-active' : ''}`}>
                    <input
                        type="radio"
                        name="location"
                        checked={filters.location === ''}
                        onChange={() => handleFilterChange('location', '')}
                        className="sr-only"
                    />
                    All
                </label>
                {LOCATIONS.map(loc => (
                    <label key={loc} className={`filter-chip ${filters.location === loc ? 'is-active' : ''}`}>
                        <input
                            type="radio"
                            name="location"
                            checked={filters.location === loc}
                            onChange={() => handleFilterChange('location', loc)}
                            className="sr-only"
                        />
                        {loc}
                    </label>
                ))}
            </div>
        </div>

        <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options-scroll">
                <label className={`filter-chip ${filters.category === '' ? 'is-active' : ''}`}>
                    <input
                        type="radio"
                        name="category"
                        checked={filters.category === ''}
                        onChange={() => handleFilterChange('category', '')}
                        className="sr-only"
                    />
                    All
                </label>
                {CATEGORIES.map(cat => (
                    <label key={cat} className={`filter-chip ${filters.category === cat ? 'is-active' : ''}`}>
                        <input
                            type="radio"
                            name="category"
                            checked={filters.category === cat}
                            onChange={() => handleFilterChange('category', cat)}
                            className="sr-only"
                        />
                        {cat}
                    </label>
                ))}
            </div>
        </div>
    </aside>
);

export default PlacesSidebar;
