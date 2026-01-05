/**
 * Places API Service
 * Handles place-related endpoints
 */

import { apiFetch } from './config';

/**
 * Get all places
 * @returns {Promise<Array>}
 */
export const listPlaces = async () => {
    return apiFetch('/place', { method: 'GET' }, false);
};

/**
 * Get single place by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const getPlace = async (id) => {
    return apiFetch(`/place/${id}`, { method: 'GET' }, false);
};

/**
 * Add new place (Admin only)
 * @param {Object} placeData 
 * @returns {Promise<Object>}
 */
export const addPlace = async (placeData) => {
    return apiFetch('/place', {
        method: 'POST',
        body: JSON.stringify(placeData),
    }, true);
};

/**
 * Update place (Admin only)
 * @param {string} id 
 * @param {Object} placeData 
 * @returns {Promise<Object>}
 */
export const updatePlace = async (id, placeData) => {
    return apiFetch(`/place/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(placeData),
    }, true);
};

/**
 * Delete place (Admin only)
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deletePlace = async (id) => {
    return apiFetch(`/place/${id}`, {
        method: 'DELETE',
    }, true);
};
