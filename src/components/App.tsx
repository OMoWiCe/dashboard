import { useState, useEffect } from "react";
import "../css/App.css";
import "../css/theme.css";
import "../css/Dashboard.css";
import Navbar from "./Navbar";
import LocationCard from "./LocationCard";
import LoadingSkeleton from "./LoadingSkeleton";
import Disclaimer from "./Disclaimer";
import Footer from "./Footer";
import { api } from "../utils/api";
import type {
  Location,
  Metrics,
  DetailedMetrics,
  LocationWithMetrics,
} from "../types/api";
import {
  transformLocationData,
  combineLocationsWithMetrics,
} from "../utils/dataTransformers";
import {
  getSearchParam,
  getLocationIdFromUrl,
  updateUrlWithSearch,
  updateUrlForLocation,
} from "../utils/urlParams";

function App() {
  // State management for locations and metrics
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [allMetrics, setAllMetrics] = useState<Metrics[]>([]);
  const [locationCards, setLocationCards] = useState<LocationWithMetrics[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<
    LocationWithMetrics[]
  >([]);

  // UI state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize app by checking URL parameters
  useEffect(() => {
    const searchParam = getSearchParam();
    const locationId = getLocationIdFromUrl();

    if (searchParam) {
      setSearchTerm(searchParam);
    } else if (locationId) {
      setSelectedLocationId(locationId);
      // Also set it as the expanded card
      setExpandedCardId(locationId);
    }

    // Fetch initial data
    fetchInitialData();
  }, []);

  // Fetch all locations and metrics on initial load
  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both locations and metrics in parallel
      const [locations, metrics] = await Promise.all([
        api.getAllLocations(),
        api.getAllMetrics(),
      ]);

      setAllLocations(locations);
      setAllMetrics(metrics);

      // Combine data into location cards
      const combinedData = combineLocationsWithMetrics(locations, metrics);
      setLocationCards(combinedData);
      setFilteredLocations(combinedData);

      // Check if we need to handle a specific location or search
      handleUrlParameters(locations, metrics);

      setLastRefreshTime(new Date());
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle URL parameters after data is loaded
  const handleUrlParameters = async (
    locations: Location[],
    metrics: Metrics[]
  ) => {
    const searchParam = getSearchParam();
    const locationId = getLocationIdFromUrl();

    if (searchParam) {
      // Handle search from URL
      handleSearch(searchParam);
    } else if (locationId) {
      // Handle direct location access
      await fetchLocationDetails(locationId);
    }
  };

  // Fetch details for a specific location
  const fetchLocationDetails = async (locationId: string) => {
    if (!locationId) return;

    try {
      // Fetch both location details and metrics in parallel
      const [locationDetails, locationMetrics] = await Promise.all([
        api.getLocationById(locationId),
        api.getLocationMetrics(locationId),
      ]);

      // Transform data into our app format
      const locationCard = transformLocationData(
        locationDetails,
        locationMetrics as DetailedMetrics
      );

      // Update selected location
      setSelectedLocationId(locationId);

      // If we have full detailed metrics, set as expanded card
      if ("todayAvgHourlyOccupancy" in locationMetrics) {
        setExpandedCardId(locationId);
      }

      // Update filtered locations while preserving other cards
      if (filteredLocations.length > 1) {
        setFilteredLocations((prev) =>
          prev.map((card) => (card.id === locationId ? locationCard : card))
        );
      } else {
        setFilteredLocations([locationCard]);
      }

      // Update URL to reflect the selected location
      updateUrlForLocation(locationId);
    } catch (err) {
      console.error(`Error fetching details for location ${locationId}:`, err);
      setError(`Could not load details for the requested location.`);

      // Reset to all locations if there's an error
      if (locationCards.length > 0) {
        setFilteredLocations(locationCards);
      }
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      // Fetch updated metrics for all locations
      const metrics = await api.getAllMetrics();
      setAllMetrics(metrics);

      // Update location cards with new metrics
      const updatedCards = combineLocationsWithMetrics(allLocations, metrics);
      setLocationCards(updatedCards);

      // Update filtered locations if needed
      if (selectedLocationId) {
        // If a specific location is selected, fetch its latest details
        await fetchLocationDetails(selectedLocationId);
      } else if (searchTerm) {
        // If search is active, update filtered results
        handleSearch(searchTerm);
      } else {
        // Otherwise show all updated locations
        setFilteredLocations(updatedCards);
      }

      setLastRefreshTime(new Date());
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh data. Please try again later.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle search functionality
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setSelectedLocationId(null);
    setExpandedCardId(null);
    setError(null);

    if (!term.trim()) {
      // If search is cleared, show all locations
      setFilteredLocations(locationCards);
      setShowNoResults(false);
      updateUrlWithSearch(null);
      return;
    }

    try {
      // Use search API to find locations
      const searchResults = await api.searchLocations(term);

      if (searchResults && searchResults.length > 0) {
        // Map search results to our location cards format
        const filteredCards = searchResults.map((location) => {
          // Find matching metrics
          const metrics = allMetrics.find(
            (m) => m.locationId === location.locationId
          );
          return transformLocationData(location, metrics);
        });

        setFilteredLocations(filteredCards);
        setShowNoResults(false);
      } else {
        setFilteredLocations([]);
        setShowNoResults(true);
      }

      // Update URL to reflect search
      updateUrlWithSearch(term);
    } catch (err) {
      console.error("Error searching locations:", err);
      setError("Search failed. Please try again.");
      setFilteredLocations(locationCards);
    }
  };

  // Handle selection of a specific location
  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    setSearchTerm("");
    fetchLocationDetails(locationId);
  };

  // Handler for when a card is clicked - fetch detailed metrics and expand the card
  const handleCardClick = async (locationId: string) => {
    if (expandedCardId === locationId) {
      // If clicking on already expanded card, collapse it
      setExpandedCardId(null);
      // Just update URL to main dashboard
      updateUrlForLocation(null);
      return;
    }

    // Set as expanded immediately for better UX
    setExpandedCardId(locationId);

    try {
      // Fetch detailed metrics for this location
      const detailedMetrics = await api.getLocationMetrics(locationId);

      // Find the location details
      const location = allLocations.find(
        (loc) => loc.locationId === locationId
      );

      if (location && detailedMetrics) {
        // Transform into our app format with detailed metrics
        const detailedCard = transformLocationData(
          location,
          detailedMetrics as DetailedMetrics
        );

        // Update this specific location card with detailed data
        setFilteredLocations((prev) =>
          prev.map((card) => (card.id === locationId ? detailedCard : card))
        );

        // Update URL
        updateUrlForLocation(locationId);
      }
    } catch (err) {
      console.error(`Error fetching detailed metrics for ${locationId}:`, err);
      // We don't set an error state here to avoid disrupting the UI
      // Just log the error and keep the card expanded with existing data
    }
  };

  // Handler for closing the expanded card
  const handleCloseCard = () => {
    setExpandedCardId(null);
    updateUrlForLocation(null);
  };

  // Reset search and show all locations
  const handleResetSearch = () => {
    setSelectedLocationId(null);
    setExpandedCardId(null);
    setSearchTerm("");
    setFilteredLocations(locationCards);
    updateUrlWithSearch(null);
  };

  // Generate loading skeleton placeholders
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => <LoadingSkeleton key={`skeleton-${index}`} />);
  };

  // Scroll to expanded card when it changes
  useEffect(() => {
    if (expandedCardId) {
      const expandedCard = document.getElementById(`card-${expandedCardId}`);
      if (expandedCard) {
        expandedCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [expandedCardId]);

  return (
    <div className={`dashboard ${isRefreshing ? "refreshing" : ""}`}>
      <Navbar
        onSearch={handleSearch}
        onRefresh={refreshData}
        onDisclaimerClick={() => setShowDisclaimer(true)}
        isRefreshing={isRefreshing}
        locations={allLocations}
        onLocationSelect={handleLocationSelect}
        selectedLocationId={selectedLocationId}
        onResetSearch={handleResetSearch}
      />

      <div className="dashboard-content">
        {isLoading ? (
          <div className="loading-container">{renderSkeletons()}</div>
        ) : error ? (
          <div className="no-results-message">
            <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
            <div>{error}</div>
            <button onClick={refreshData} className="refresh-btn">
              Try Again
            </button>
          </div>
        ) : showNoResults ? (
          <div className="no-results-message">
            <i className="fa fa-search-minus" aria-hidden="true"></i>
            <div>No results found for "{searchTerm}"</div>
            <div>
              Try a different search term or clear the search to see all
              locations.
            </div>
          </div>
        ) : (
          <div className="location-grid">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onCardClick={handleCardClick}
                isExpanded={location.id === expandedCardId}
                onClose={handleCloseCard}
                id={`card-${location.id}`}
              />
            ))}
          </div>
        )}
      </div>

      <Footer lastRefreshTime={lastRefreshTime} />

      {showDisclaimer && (
        <Disclaimer onClose={() => setShowDisclaimer(false)} />
      )}
    </div>
  );
}

export default App;
