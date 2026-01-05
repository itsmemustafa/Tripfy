/**
 * Reviews API Service
 * Handles review-related endpoints
 */

import { apiFetch } from './config';

/**
 * Get reviews for a place
 * @param {string} placeId 
 * @returns {Promise<Array>}
 */
export const getReviews = async (placeId) => {
    return apiFetch(`/reviews/${placeId}`, { method: 'GET' }, false);
};

/**
 * Add new review (Authenticated users)
 * @param {Object} reviewData - { place, text, rating }
 * @returns {Promise<Object>}
 */
export const addReview = async (reviewData) => {
    return apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
    }, true);
};

/**
 * Update review (Owner only)
 * @param {string} reviewId 
 * @param {Object} reviewData 
 * @returns {Promise<Object>}
 */
export const updateReview = async (reviewId, reviewData) => {
    return apiFetch(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData),
    }, true);
};

/**
 * Delete review (Owner only)
 * @param {string} reviewId 
 * @returns {Promise<Object>}
 */
export const deleteReview = async (reviewId) => {
    return apiFetch(`/reviews/${reviewId}`, {
        method: 'DELETE',
    }, true);
};
