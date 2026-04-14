import { env } from '../config/env.js';
import { request } from './client.js';

const BASE_URL = env.api.endpoints.places;

/**
 * Fetch list of places with optional filters
 */
export const getPlaces = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.city) queryParams.append('city', params.city);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const suffix = queryParams.toString();
    const url = suffix ? `${BASE_URL}?${suffix}` : BASE_URL;
    return request(url, { method: 'GET' });
};

/**
 * Fetch a single place by ID
 */
export const getPlaceById = async (placeId) => {
    return request(`${BASE_URL}/${placeId}`, { method: 'GET' });
};
