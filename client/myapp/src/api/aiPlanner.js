import { env } from '../config/env.js';
import { request } from './client.js';

const BASE_URL = env.api.endpoints.aiPlanner;


export const generateTripPlan = async (prompt, history = [], currentPlan = null) => {
    return request(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, history, currentPlan }),
    });
};
