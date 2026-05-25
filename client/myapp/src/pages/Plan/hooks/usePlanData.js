import { useState, useEffect } from 'react';
import { getPlaces } from '../../../api/places';
import { getPlanById, createPlan, updatePlan } from '../../../api/plans';

export const usePlanData = (editId, user, navigate) => {
  const [activeDay, setActiveDay] = useState(1);
  const [dayPlaces, setDayPlaces] = useState({});
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [tripDetails, setTripDetails] = useState({
    title: "",
    city: "Erbil",
    duration: 3,
    startDate: "",
    planType: "leisure",
    note: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PLACES_PER_PAGE = 12;

  useEffect(() => {
    let active = true;
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        setPlaces([]);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        );
        const fetchPromise = getPlaces({
          city: tripDetails.city,
          limit: PLACES_PER_PAGE,
          page: 1,
          sort: "-rating",
        });

        const data = await Promise.race([fetchPromise, timeoutPromise]);
        if (active) {
          setPlaces(data.places || []);
          setTotalPages(data.totalPages || 1);
          setHasMore(data.page < data.totalPages);
        }
      } catch (err) {
        console.error("Error fetching places:", err);
        if (active) setMessage({ type: "error", text: "Failed to load destinations. Please try refreshing." });
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPlaces();
    return () => { active = false; };
  }, [tripDetails.city]);

  useEffect(() => {
    if (!editId || !user) return;
    const fetchPlan = async () => {
      try {
        setLoadingPlan(true);
        const data = await getPlanById(editId);
        const plan = data.plan;
        const formattedDate = plan.startDate ? new Date(plan.startDate).toISOString().split("T")[0] : "";
        setTripDetails({
          title: plan.planTitle || "",
          city: plan.city || "Erbil",
          duration: plan.duration || 3,
          startDate: formattedDate,
          planType: plan.planType || "leisure",
          note: plan.note || "",
        });
        const newDayPlaces = {};
        if (plan.days && Array.isArray(plan.days)) {
          plan.days.forEach(day => {
            const placeIds = [];
            if (day.places && Array.isArray(day.places)) {
              day.places.forEach(p => {
                const id = typeof p.place === "object" ? p.place._id : p.place;
                if (id) placeIds.push(id);
              });
            }
            if (placeIds.length > 0) newDayPlaces[day.dayNumber] = placeIds;
          });
        }
        setDayPlaces(newDayPlaces);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setMessage({ type: "error", text: "Failed to load plan data." });
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [editId, user]);

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    try {
      setLoading(true);
      const data = await getPlaces({ city: tripDetails.city, limit: PLACES_PER_PAGE, page: newPage, sort: "-rating" });
      setPlaces(data.places || []);
      setCurrentPage(newPage);
      setHasMore(data.page < data.totalPages);
    } catch (err) {
      console.error("Error changing page:", err);
      setMessage({ type: "error", text: "Failed to load destinations page." });
    } finally {
      setLoading(false);
    }
  };

  const togglePlaceSelection = (placeId) => {
    setDayPlaces(prev => {
      const newState = { ...prev };
      let existingDay = null;
      Object.keys(newState).forEach(day => {
        if (newState[day].includes(placeId)) existingDay = day;
      });
      if (existingDay) {
        newState[existingDay] = newState[existingDay].filter(id => id !== placeId);
        if (newState[existingDay].length === 0) delete newState[existingDay];
      } else {
        const currentList = newState[activeDay] || [];
        newState[activeDay] = [...currentList, placeId];
      }
      return newState;
    });
  };

  const getAssignedDay = (placeId) => {
    for (const day of Object.keys(dayPlaces)) {
      if (dayPlaces[day].includes(placeId)) return parseInt(day);
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!user) {
      const msg = "Please log in to save a trip plan.";
      setMessage({ type: "error", text: msg });
      alert(msg);
      return;
    }
    const totalPlaces = Object.values(dayPlaces).reduce((acc, list) => acc + list.length, 0);
    if (totalPlaces === 0) {
      setMessage({ type: "error", text: "Please select at least one destination." });
      return;
    }
    setSubmitting(true);
    try {
      const duration = Number.parseInt(tripDetails.duration, 10);
      const days = [];
      for (let i = 1; i <= duration; i++) {
        const date = tripDetails.startDate ? new Date(tripDetails.startDate) : new Date();
        if (i > 1) date.setDate(date.getDate() + (i - 1));
        const placesForDay = dayPlaces[i] || [];
        days.push({
          dayNumber: i,
          date: date,
          places: placesForDay.map((placeId, index) => ({
            place: placeId,
            order: index + 1,
            visitTime: "Morning",
            note: ""
          }))
        });
      }
      const planData = {
        planTitle: tripDetails.title,
        city: tripDetails.city,
        duration: duration,
        startDate: tripDetails.startDate,
        planType: tripDetails.planType,
        note: tripDetails.note,
        days: days,
        status: 'draft'
      };
      if (editId) {
        await updatePlan(editId, planData);
        setMessage({ type: "success", text: "Trip plan updated successfully." });
        setTimeout(() => navigate(`/my-plans/${editId}`), 1500);
      } else {
        const response = await createPlan(planData);
        setMessage({ type: "success", text: "Trip plan created successfully." });
        setTimeout(() => navigate(`/my-plans/${response.plan._id}`), 1500);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to save trip plan." });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    activeDay, setActiveDay, dayPlaces, setDayPlaces, places, loading, loadingPlan,
    submitting, message, tripDetails, currentPage, totalPages,
    togglePlaceSelection, getAssignedDay, handleInputChange, handleSubmit, handlePageChange
  };
};
