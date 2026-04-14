import { useState } from 'react';
import { getPlans, updatePlan } from '../../../api/plans';

export const useItinerary = (id, placeName, isAuthenticated, openAuthModal) => {
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [userPlans, setUserPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const handleAddToItinerary = async () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    setShowItineraryModal(true);
    setLoadingPlans(true);
    try {
      const data = await getPlans();
      setUserPlans(data.plans || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      alert("Failed to load your trips. Please try again.");
      setShowItineraryModal(false);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleAddPlaceToPlan = async (planId) => {
    try {
      const selectedPlan = userPlans.find(p => p._id === planId);
      if (!selectedPlan) throw new Error("Plan not found");

      if (selectedPlan.places?.includes(id)) {
        alert("This place is already in your trip!");
        return;
      }

      const updatedPlaces = [...(selectedPlan.places || []), id];
      await updatePlan(planId, { places: updatedPlaces });

      alert(`Successfully added ${placeName} to ${selectedPlan.planTitle}!`);
      setShowItineraryModal(false);
    } catch (err) {
      console.error("Error adding place to plan:", err);
      alert("Failed to add place to trip. Please try again.");
      throw err;
    }
  };

  return {
    showItineraryModal, setShowItineraryModal,
    userPlans, loadingPlans, handleAddToItinerary, handleAddPlaceToPlan
  };
};
