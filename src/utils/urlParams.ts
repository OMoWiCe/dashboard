/**
 * URL parameter handling functions
 */

// Get search parameter from URL
export const getSearchParam = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('text');
};

// Get location ID from URL path
export const getLocationIdFromUrl = (): string | null => {
  // Extract location ID from URL path if format is /location/{id}
  const path = window.location.pathname;
  const matches = path.match(/\/location\/([^\/]+)/);
  return matches ? matches[1] : null;
};

// Update URL with search parameter without reloading page
export const updateUrlWithSearch = (searchTerm: string | null) => {
  const url = new URL(window.location.href);
  
  if (searchTerm && searchTerm.trim() !== '') {
    url.searchParams.set('text', searchTerm);
    url.pathname = '/search';
  } else {
    url.searchParams.delete('text');
    url.pathname = '/';
  }
  
  window.history.pushState({}, '', url);
};

// Update URL for specific location
export const updateUrlForLocation = (locationId: string | null) => {
  if (locationId) {
    const url = new URL(window.location.href);
    url.pathname = `/location/${locationId}`;
    url.search = '';
    window.history.pushState({}, '', url);
  } else {
    // Reset to home if no location ID
    const url = new URL(window.location.href);
    url.pathname = '/';
    url.search = '';
    window.history.pushState({}, '', url);
  }
};

// Admin route utilities
export const navigateToAdmin = () => {
  window.location.href = '/admin';
};

export const navigateToDashboard = () => {
  window.location.href = '/';
};

export const isAdminRoute = () => {
  return window.location.pathname === '/admin';
};