import { useState, useEffect } from 'react';
import { getPlaces } from '../../../api/places';

export const useMapPlaces = (filters, debouncedSearch) => {
    const [allPlaces, setAllPlaces] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPlaces = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPlaces({ limit: 1000 });
                if (data.success && data.places) {
                    setAllPlaces(data.places);
                    setPlaces(data.places);
                } else {
                    setError('Failed to fetch places');
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error connecting to server');
            } finally {
                setLoading(false);
            }
        };

        fetchAllPlaces();
    }, []);

    useEffect(() => {
        let filtered = [...allPlaces];

        if (debouncedSearch.trim()) {
            const searchLower = debouncedSearch.toLowerCase();
            filtered = filtered.filter(place =>
                place.name?.toLowerCase().includes(searchLower) ||
                place.description?.toLowerCase().includes(searchLower) ||
                place.category?.toLowerCase().includes(searchLower)
            );
        }

        if (filters.category) {
            filtered = filtered.filter(place => place.category === filters.category);
        }

        if (filters.city) {
            filtered = filtered.filter(place => place.location?.city === filters.city);
        }

        setPlaces(filtered);
    }, [allPlaces, debouncedSearch, filters.category, filters.city]);

    return { allPlaces, places, loading, error };
};
