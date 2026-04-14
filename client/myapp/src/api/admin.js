import { env } from '../config/env.js';
import { request } from './client.js';

const BASE_URL = env.api.endpoints.admin;

export const getAllUsersAdmin = async () => {
    return request(`${BASE_URL}/users`, { method: 'GET' });
};

export const getAllPlacesAdmin = async () => {
    return request(`${BASE_URL}/places`, { method: 'GET' });
};

export const getAllReviewsAdmin = async () => {
    return request(`${BASE_URL}/reviews`, { method: 'GET' });
};

export const updateUserRole = async (userId, role) => {
    return request(`${BASE_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    });
};

export const deletePlaceAdmin = async (placeId) => {
    return request(`${BASE_URL}/places/${placeId}`, { method: 'DELETE' });
};

export const deleteReviewAdmin = async (reviewId) => {
    return request(`${BASE_URL}/reviews/${reviewId}`, { method: 'DELETE' });
};

export const createUserAdmin = async (userData) => {
    return request(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};

export const deleteUserAdmin = async (userId) => {
    return request(`${BASE_URL}/users/${userId}`, { method: 'DELETE' });
};

export const getPlaceAdmin = async (placeId) => {
    return request(`${env.api.endpoints.places}/${placeId}`, { method: 'GET' });
};

// Use places endpoint for place-specific operations
const PLACE_URL = env.api.endpoints.places;

export const updatePlaceAdmin = async (placeId, placeData) => {
    return request(`${PLACE_URL}/${placeId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
    });
};

export const createPlaceAdmin = async (placeData) => {
    // Uses the generic place creation endpoint which requires auth and admin role
    return request(PLACE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
    });
};

export const uploadPlaceImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);


    return request(`${PLACE_URL}/upload-image`, {
        method: 'POST',
        body: formData,
    });
};
