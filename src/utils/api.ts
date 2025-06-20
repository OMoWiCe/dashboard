// Base API URL and configurations
const API_BASE_URL = 'https://api.omowice.live/v1';

// Local proxy URL for development (uses Vite's proxy configuration)
const DEV_PROXY_URL = '/api/v1';

// Function to get API key from environment variables for Azure Static Web Apps
const getApiKey = () => {
  // In Vite, environment variables are embedded at build time
  // Variables starting with VITE_ are automatically exposed to the client
  const apiKey = import.meta.env.VITE_API_KEY || '';
  
  if (!apiKey && !isDevelopment()) {
    console.warn('API Key not found. Authentication may fail.');
  }
  return apiKey;
};

// Function to determine if we're in development mode
const isDevelopment = () => {
  // @ts-ignore - Vite specific property
  return import.meta.env?.MODE === 'development' || window.location.hostname === 'localhost';
};

// Get the appropriate base URL based on environment
const getBaseUrl = () => {
  // Use local proxy in development, direct URL in production
  return isDevelopment() ? DEV_PROXY_URL : API_BASE_URL;
};

// Generic fetch function with API key authentication for Azure API Management
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const headers = new Headers(options.headers || {});
    const apiKey = getApiKey();
    
    // Add API Key in the header for Azure API Management
    if (apiKey) {
      // Using only API-Key header as requested
      headers.set('API-Key', apiKey);
    }
    
    // Add standard content-type if not specified
    if (!headers.has('Content-Type')) {
      headers.append('Content-Type', 'application/json');
    }
      // Log request details in development mode only
    if (isDevelopment()) {
      // Only log the endpoint in development, no headers or API key info
      console.debug('API Request:', `${getBaseUrl()}${endpoint}`);
    }

    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      ...options,
      headers,
      // For Azure API Management, we should not include credentials as it may interfere with CORS
      // Only include if specifically required by your API
      credentials: 'same-origin',
    });

    if (!response.ok) {
      // Enhanced error logging to help with debugging
      console.error('API error details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url.replace(/\/v1\/.+/, '/v1/[endpoint]'), // Mask specific endpoint for security
      });
      
      // Try to parse error response if possible
      try {
        // Only log non-sensitive error information
        console.error('API error response status:', response.status);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      } catch (e) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
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