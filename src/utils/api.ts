// Base API URL and configurations
const API_BASE_URL = 'https://api.omowice.live/v1';

// Local proxy URL for development (uses Vite's proxy configuration)
const DEV_PROXY_URL = '/api/v1';

// Function to get API key from environment variables
const getApiKey = () => {
  return import.meta.env.VITE_API_KEY || '';
};

// Function to determine if we're in development mode
const isDevelopment = () => {
  return import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';
};

// Get the appropriate base URL based on environment
const getBaseUrl = () => {
  // Use local proxy in development, direct URL in production
  return isDevelopment() ? DEV_PROXY_URL : API_BASE_URL;
};

// Generic fetch function with API key authentication
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const headers = new Headers(options.headers || {});
    headers.append('API-Key', getApiKey());

    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

// API endpoints
export const api = {
  // Get all locations
  getAllLocations: () => {
    return fetchWithAuth('/locations');
  },

  // Get location by ID
  getLocationById: (locationId: string) => {
    return fetchWithAuth(`/locations/${locationId}`);
  },

  // Search locations
  searchLocations: (searchTerm: string) => {
    return fetchWithAuth(`/search?text=${encodeURIComponent(searchTerm)}`);
  },

  // Get all metrics
  getAllMetrics: () => {
    return fetchWithAuth('/metrics');
  },

  // Get metrics for a specific location
  getLocationMetrics: (locationId: string) => {
    return fetchWithAuth(`/metrics/${locationId}`);
  },
};