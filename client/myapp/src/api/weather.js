import { env } from '../config/env.js';

const BASE_URL = env.api.endpoints.weather;


export const getWeatherByPlaceId = async (placeId) => {
    const response = await fetch(`${BASE_URL}/${placeId}`, {
        method: 'GET',
        credentials: 'include',
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : null;

    if (!response.ok) {
        throw new Error(payload?.message || `Weather request failed (${response.status})`);
    }

    return payload;
};
