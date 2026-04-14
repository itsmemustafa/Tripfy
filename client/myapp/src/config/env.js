

/**
 * Environment Configuration
 * 
 * This module provides centralized access to all environment variables.
 * All environment variables must be accessed through this file only.
 * Direct access to import.meta.env in components or services is not allowed.
 * 
 * The configuration validates all required environment variables at startup
 * and throws descriptive errors if any are missing.
 */

// List of required environment variables
const requiredEnv = [
    'VITE_API_BASE_URL',
    'VITE_APP_NAME',
    'VITE_APP_ENV'
];

// Validate that all required environment variables are defined
requiredEnv.forEach((key) => {
    if (!import.meta.env[key]) {
        throw new Error(
            `Missing required environment variable: ${key}
       
Please define it in your .env.local file for development or .env.production for production.
See .env.example for reference.`
        );
    }
});

// Normalize API_BASE_URL:
//  - Relative paths like "/api/v1" are kept as-is (Docker Compose / same-origin)
//  - Bare hostnames like "api.example.com" are prefixed with https://
//  - Full http(s):// URLs are used as-is
let apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
if (!apiBaseUrl) {
    throw new Error('Missing VITE_API_BASE_URL');
}
if (
    !apiBaseUrl.startsWith('/') &&
    !apiBaseUrl.startsWith('http://') &&
    !apiBaseUrl.startsWith('https://')
) {
    // Bare hostname — add https://
    apiBaseUrl = `https://${apiBaseUrl}`;
}
apiBaseUrl = apiBaseUrl.replace(/\/+$/, ''); // strip trailing slashes

// Validate APP_ENV value
const validEnvironments = ['development', 'staging', 'production'];
const appEnv = import.meta.env.VITE_APP_ENV;
if (!validEnvironments.includes(appEnv)) {
    throw new Error(
        `Invalid VITE_APP_ENV: "${appEnv}"
     
Must be one of: ${validEnvironments.join(', ')}`
    );
}

/**
 * Centralized environment configuration object
 * All application code should import and use this object instead of accessing import.meta.env directly
 */
export const env = {
    // API Configuration
    api: {
        baseUrl: apiBaseUrl,
        // Derived endpoints for convenience
        endpoints: {
            auth: `${apiBaseUrl}/auth`,
            places: `${apiBaseUrl}/place`,
            plans: `${apiBaseUrl}/plan`,
            reviews: `${apiBaseUrl}/reviews`,
            admin: `${apiBaseUrl}/admin`,
            aiPlanner: `${apiBaseUrl}/ai-planner`,
            weather: `${apiBaseUrl}/weather`
        }
    },

    // Application Configuration
    app: {
        name: import.meta.env.VITE_APP_NAME,
        environment: appEnv,
        isDevelopment: appEnv === 'development',
        isProduction: appEnv === 'production',
        isStaging: appEnv === 'staging'
    }
};

// Log configuration in development (but not the values for security)
if (env.app.isDevelopment) {
    console.log('Environment configuration loaded successfully');
    console.log('Environment:', env.app.environment);
    console.log('API Base URL:', env.api.baseUrl);
}

export default env;
