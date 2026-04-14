import { useState, useEffect } from 'react';
import { getPlanById, updatePlan } from '../../../api/plans';

export const usePlanDetailsPage = (planId) => {
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showShare, setShowShare] = useState(false);

    useEffect(() => {
        const loadPlan = async () => {
            try {
                setIsLoading(true);
                const data = await getPlanById(planId);
                setPlan(data.plan);
            } catch (err) {
                console.error('Error loading plan:', err);
                setError('Failed to load plan');
            } finally {
                setIsLoading(false);
            }
        };

        loadPlan();
    }, [planId]);

    const handleSave = async (updatedPlan) => {
        try {
            await updatePlan(planId, updatedPlan);
            setPlan(updatedPlan);
            alert('Plan saved successfully!');
        } catch (err) {
            console.error('Error saving plan:', err);
            alert('Failed to save plan');
        }
    };

    return {
        plan, setPlan, isLoading, error,
        showShare, setShowShare, handleSave
    };
};
