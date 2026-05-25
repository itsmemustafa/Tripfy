import { useState, useEffect, useCallback } from 'react';
import { getPlans, deletePlan } from '../../../api/plans';

export const useMyPlans = (user, showToast) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [planToDelete, setPlanToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const PLANS_PER_PAGE = 6;

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchPlans = async () => {
            try {
                setLoading(true);
                const data = await getPlans({ page: 1, limit: PLANS_PER_PAGE });
                setPlans(data.plans || []);
                setCurrentPage(1);
                setHasMore(data.page < data.totalPages);
            } catch (err) {
                console.error('Error fetching plans:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [user]);

    const loadMorePlans = async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const data = await getPlans({ page: nextPage, limit: PLANS_PER_PAGE });

            setPlans(prev => [...prev, ...(data.plans || [])]);
            setCurrentPage(nextPage);
            setHasMore(data.page < data.totalPages);
        } catch (err) {
            console.error('Error loading more plans:', err);
            showToast('Failed to load more plans', 'error');
        } finally {
            setLoadingMore(false);
        }
    };

    const initiateDelete = useCallback((e, planId) => {
        e.stopPropagation();
        setPlanToDelete(planId);
    }, []);

    const cancelDelete = useCallback(() => {
        setPlanToDelete(null);
    }, []);

    const confirmDelete = async () => {
        if (!planToDelete) return;

        try {
            await deletePlan(planToDelete);
            setPlans(prev => prev.filter(p => p._id !== planToDelete));
            showToast('Plan deleted successfully', 'success');
        } catch (err) {
            showToast('Failed to delete plan: ' + err.message, 'error');
        } finally {
            setPlanToDelete(null);
        }
    };

    return {
        plans,
        loading,
        error,
        hasMore,
        loadingMore,
        planToDelete,
        loadMorePlans,
        initiateDelete,
        confirmDelete,
        cancelDelete
    };
};
