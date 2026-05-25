import { useState, useEffect, useCallback } from 'react';
import { getPlanById, deletePlan, updatePlan } from '../../../api/plans';

export const usePlanDetails = (id, user, showToast, navigate) => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        setLoading(true);
        const data = await getPlanById(id);
        setPlan(data.plan);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setError(err.message);
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, user, showToast]);

  const handlePlanUpdate = useCallback(async (updatedDays) => {
    const updatedPlan = { ...plan, days: updatedDays };
    setPlan(updatedPlan);

    try {
      await updatePlan(id, { days: updatedDays });
    } catch (err) {
      console.error("Failed to save order:", err);
      showToast("Failed to save changes", "error");
    }
  }, [id, plan, showToast]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const items = Array.from(plan.days);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reindexedItems = items.map((day, index) => ({
      ...day,
      dayNumber: index + 1,
    }));

    handlePlanUpdate(reindexedItems);
  }, [plan, handlePlanUpdate]);

  const handleDeleteDay = useCallback(async (dayIndex) => {
    if (!window.confirm("Are you sure you want to remove this day from your journey?")) return;

    const items = Array.from(plan.days);
    items.splice(dayIndex, 1);

    const reindexedItems = items.map((day, index) => ({
      ...day,
      dayNumber: index + 1,
    }));

    handlePlanUpdate(reindexedItems);
  }, [plan, handlePlanUpdate]);

  const handlePlanDelete = async () => {
    try {
      await deletePlan(id);
      showToast("Plan deleted successfully", "success");
      navigate("/my-plans");
    } catch (err) {
      showToast("Failed to delete plan: " + err.message, "error");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return {
    plan, loading, error, showDeleteModal, setShowDeleteModal,
    handlePlanDelete, handleDeleteDay, onDragEnd
  };
};
