import React from 'react';
import './PlaceChip.css';

const PlaceChip = ({ placeItem }) => {
    const place = placeItem.place;
    const img = place?.images?.[0];

    return (
        <div className="aip-place-chip">
            <div className="aip-place-img">
                {img ? <img src={img} alt={place?.name} /> : <span>📍</span>}
            </div>
            <div className="aip-place-info">
                <div className="aip-place-name">{place?.name || 'Place'}</div>
                <div className="aip-place-meta">
                    {place?.category && <span>{place.category}</span>}
                    {place?.rating > 0 && <span>⭐ {place.rating.toFixed(1)}</span>}
                    {placeItem.visitTime && <span>· {placeItem.visitTime}</span>}
                </div>
            </div>
        </div>
    );
};

export default PlaceChip;
