import { env } from '../config/env.js';
import { request } from './client.js';

const BASE_URL = env.api.endpoints.plans;


export const createPlan = async (planData) => {
    return request(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
    });
};

/**
 * Get user's plans
 */
export const getPlans = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = queryParams.toString() ? `${BASE_URL}?${queryParams.toString()}` : BASE_URL;

    return request(url, { method: 'GET' });
};

/**
 * Get a single plan by ID
 */
export const getPlanById = async (planId) => {
    return request(`${BASE_URL}/${planId}`, { method: 'GET' });
};

/**
 * Delete a plan by ID
 */
export const deletePlan = async (planId) => {
    return request(`${BASE_URL}/${planId}`, { method: 'DELETE' });
};

/**
 * Update a plan
 */
export const updatePlan = async (planId, planData) => {
    return request(`${BASE_URL}/${planId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
    });
};

// Fetch a shared (published) plan by ID — no auth required
export const getSharedPlan = async (planId) => {
    return request(`${BASE_URL}/shared/${planId}`, { method: 'GET' });
};
