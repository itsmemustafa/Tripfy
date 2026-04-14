import { useState, useEffect } from 'react';
import { env } from '../../../config/env.js';

export const usePlaceDetails = (id, isAuthenticated, user) => {
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchPlaceAndReviews = async () => {
      setLoading(true);
      try {
        const placeRes = await fetch(`${env.api.endpoints.places}/${id}`);
        const placeData = await placeRes.json();

        if (placeData.success) {
          setPlace(placeData.place);
        } else {
          setError("Place not found");
          setLoading(false);
          return;
        }

        try {
          const reviewsRes = await fetch(`${env.api.endpoints.reviews}/${id}?page=1&limit=5`);
          const reviewsData = await reviewsRes.json();
          if (reviewsData.reviews) {
            setReviews(reviewsData.reviews);
            setTotalReviews(reviewsData.total || 0);
            setHasMoreReviews(reviewsData.page < reviewsData.totalPages);
            setReviewPage(1);
          }
        } catch (reviewErr) {
          console.error("Error fetching reviews:", reviewErr);
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlaceAndReviews();
  }, [id]);

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!isAuthenticated) return;
    setSubmittingReview(true);
    try {
      const response = await fetch(env.api.endpoints.reviews, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ placeId: id, rating, comment }),
      });
      const data = await response.json();
      if (response.ok) {
        const newReview = {
          ...data.review,
          user: { name: user?.name || user?.username || "You" },
        };
        setReviews([newReview, ...reviews]);
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const loadMoreReviews = async () => {
    if (loadingMoreReviews || !hasMoreReviews) return;
    try {
      setLoadingMoreReviews(true);
      const nextPage = reviewPage + 1;
      const response = await fetch(`${env.api.endpoints.reviews}/${id}?page=${nextPage}&limit=5`);
      const data = await response.json();

      if (data.reviews) {
        setReviews(prev => [...prev, ...data.reviews]);
        setReviewPage(nextPage);
        setHasMoreReviews(data.page < data.totalPages);
      }
    } catch (err) {
      console.error("Error loading more reviews:", err);
    } finally {
      setLoadingMoreReviews(false);
    }
  };

  return {
    place, reviews, loading, error, submittingReview,
    hasMoreReviews, loadingMoreReviews, totalReviews,
    handleReviewSubmit, loadMoreReviews
  };
};
