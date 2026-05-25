import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPlaces } from '../../../api/places';

export const usePlaces = () => {
    const locationObj = useLocation();
    const queryParams = new URLSearchParams(locationObj.search);
    const initialLocation = queryParams.get('location') || '';

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metadata, setMetadata] = useState({ total: 0, page: 1, totalPages: 1 });

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        location: initialLocation, 
        sort: '-createdAt'
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPlaces({
                    search: debouncedSearch,
                    category: filters.category,
                    city: filters.location,
                    sort: filters.sort,
                    page: metadata.page,
                    limit: 12
                });

                if (data.success) {
                    setPlaces(data.places);
                    setMetadata({
                        total: data.total,
                        page: data.page,
                        totalPages: data.totalPages
                    });
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

        fetchPlaces();
    }, [debouncedSearch, filters.category, filters.location, filters.sort, metadata.page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setMetadata(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setMetadata(prev => ({ ...prev, page: newPage }));
    };

    const clearFilters = () => {
        setFilters({ search: '', category: '', location: '', sort: '-createdAt' });
        setMetadata(prev => ({ ...prev, page: 1 }));
    };

    return {
        places,
        loading,
        error,
        metadata,
        filters,
        handleFilterChange,
        handlePageChange,
        clearFilters
    };
};
