import { useState, useEffect } from 'react';
import { listPlaces } from '../api/placesApi';

const Places = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const data = await listPlaces();
                setPlaces(data);
            } catch (err) {
                // setError('Failed to load places');
                // For development, let's just log it and show empty state if server is down
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    return (
        <div className="places-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Explore Places</h1>
                    <p className="text-muted">Discover amazing destinations.</p>
                </div>
                <button className="btn btn-primary">Filter</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading places...</div>
            ) : error ? (
                <div style={{ color: 'var(--color-error)' }}>{error}</div>
            ) : (
                <div className="places-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {places.length > 0 ? (
                        places.map((place) => (
                            <div key={place._id} className="card">
                                {place.images && place.images[0] && (
                                    <img
                                        src={place.images[0]}
                                        alt={place.name}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: 'var(--border-radius-md)',
                                            marginBottom: '1rem'
                                        }}
                                    />
                                )}
                                <h3>{place.name}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    {place.category} • {place.location?.city}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button className="btn btn-primary" style={{ width: '100%' }}>View Details</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                            <h3>No places found</h3>
                            <p className="text-muted">Be the first to add a place!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Places;
