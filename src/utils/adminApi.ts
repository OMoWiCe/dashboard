// Admin API functions for managing locations
import type { LocationCreateRequest, LocationUpdateRequest } from '../types/admin';

// Base API URL for admin operations
const ADMIN_API_BASE_URL = 'https://api.omowice.live/admin/v1';

// Local proxy URL for development
const DEV_PROXY_URL = '/api/admin/v1';

// Function to get admin API key from environment variables
const getAdminApiKey = () => {
  // @ts-ignore - Vite specific property
  const apiKey = import.meta.env?.VITE_ADMIN_API_KEY || '';
  
  if (!apiKey && !isDevelopment()) {
    console.warn('Admin API Key not found. Authentication may fail.');
  }
  return apiKey;
};

// Function to determine if we're in development mode
const isDevelopment = () => {
  // @ts-ignore - Vite specific property
  return import.meta.env?.MODE === 'development' || window.location.hostname === 'localhost';
};

// Get the appropriate base URL based on environment
const getAdminBaseUrl = () => {
  return isDevelopment() ? DEV_PROXY_URL : ADMIN_API_BASE_URL;
};

// Generic fetch function with admin API key authentication
const fetchWithAdminAuth = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const headers = new Headers(options.headers || {});
    const apiKey = getAdminApiKey();
    
    // Add Admin API Key in the header
    if (apiKey) {
      headers.set('API-Key', apiKey);
    }
    
    // Add standard content-type if not specified
    if (!headers.has('Content-Type')) {
      headers.append('Content-Type', 'application/json');
    }

    // Log request details in development mode only
    if (isDevelopment()) {
      console.debug('Admin API Request:', `${getAdminBaseUrl()}${endpoint}`);
    }

    const response = await fetch(`${getAdminBaseUrl()}${endpoint}`, {
      ...options,
      headers,
      credentials: 'same-origin',
    });    if (!response.ok) {
      console.error('Admin API error details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url.replace(/\/v1\/.+/, '/v1/[endpoint]'),
      });
      
      throw new Error(`Admin API error: ${response.status} ${response.statusText}`);
    }

    // Check if the response has content before trying to parse it as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json') && response.status !== 204) {
      // Only parse as JSON if we have JSON content and it's not a 204 No Content response
      const text = await response.text();
      // Return empty object for empty responses to prevent JSON parse errors
      return text ? JSON.parse(text) : {};
    } else {
      // For non-JSON responses or empty responses, return a success object
      return { success: true };
    }
  } catch (error) {
    console.error('Admin API fetch error:', error);
    throw error;
  }
};

// Admin API endpoints
export const adminApi = {
  // Get all locations
  getAllLocations: () => {
    return fetchWithAdminAuth('/locations');
  },

  // Add a new location
  addLocation: (locationData: LocationCreateRequest) => {
    return fetchWithAdminAuth('/locations/add', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  },

  // Update an existing location
  updateLocation: (locationId: string, locationData: LocationUpdateRequest) => {
    return fetchWithAdminAuth(`/locations/update/${locationId}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  },

  // Delete a location
  deleteLocation: (locationId: string) => {
    return fetchWithAdminAuth(`/locations/remove/${locationId}`, {
      method: 'DELETE',
    });
  },

  // Debug function to check admin API key
  verifyAdminApiKey: () => {
    const hasApiKey = !!getAdminApiKey();
    console.log('Admin API Key configured:', hasApiKey);
    return { success: true, message: 'Check console for Admin API key details' };
  },
};