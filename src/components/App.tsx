import { useState, useEffect } from "react";
import "../css/App.css";
import "../css/theme.css";
import "../css/Dashboard.css";
import Navbar from "./Navbar";
import LocationCard from "./LocationCard";
import LoadingSkeleton from "./LoadingSkeleton";
import Disclaimer from "./Disclaimer";
import Footer from "./Footer";

// Mock data for testing, will be replaced with API data later
const mockLocations = [
  {
    id: 1,
    name: "Colombo Main Branch",
    address: "123 Galle Road, Colombo 03",
    openHours: "Monday-Friday: 8:30 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM",
    currentOccupancy: 32,
    trend: "up",
    trendPercentage: 15,
    waitingTime: "12 min",
    isLive: true,
    hourlyTrend: [20, 25, 30, 28, 32, 35, 40, 32],
    lastUpdated: new Date(Date.now() - 15 * 60000), // 15 minutes ago
  },
  {
    id: 2,
    name: "Kandy City Center",
    address: "45 Dalada Veediya, Kandy",
    openHours: "Monday-Friday: 9:00 AM - 5:30 PM, Saturday: 9:00 AM - 2:00 PM",
    currentOccupancy: 18,
    trend: "down",
    trendPercentage: 8,
    waitingTime: "5 min",
    isLive: true,
    hourlyTrend: [25, 30, 28, 20, 18, 15, 12, 18],
    lastUpdated: new Date(Date.now() - 30 * 60000), // 30 minutes ago
  },
  {
    id: 3,
    name: "Galle Fort Branch",
    address: "78 Church Street, Fort, Galle",
    openHours: "Monday-Friday: 9:00 AM - 4:30 PM",
    currentOccupancy: 10,
    trend: "stable",
    trendPercentage: 0,
    waitingTime: "3 min",
    isLive: true,
    hourlyTrend: [8, 9, 12, 15, 14, 10, 9, 10],
    lastUpdated: new Date(Date.now() - 45 * 60000), // 45 minutes ago
  },
  {
    id: 4,
    name: "Negombo Beach Branch",
    address: "24 Lewis Place, Negombo",
    openHours: "Monday-Saturday: 8:30 AM - 6:00 PM",
    currentOccupancy: 22,
    trend: "up",
    trendPercentage: 12,
    waitingTime: "8 min",
    isLive: true,
    hourlyTrend: [10, 15, 18, 20, 18, 20, 24, 22],
    lastUpdated: new Date(Date.now() - 60 * 60000), // 60 minutes ago
  },
  {
    id: 5,
    name: "Jaffna Main Center",
    address: "56 Hospital Road, Jaffna",
    openHours: "Monday-Friday: 9:00 AM - 5:00 PM",
    currentOccupancy: 15,
    trend: "down",
    trendPercentage: 5,
    waitingTime: "4 min",
    isLive: false, // This location is offline
    hourlyTrend: [18, 20, 22, 20, 16, 15, 14, 15],
    lastUpdated: new Date(Date.now() - 90 * 60000), // 90 minutes ago
  },
  {
    id: 6,
    name: "Batticaloa Hub",
    address: "33 Lagoon Road, Batticaloa",
    openHours: "Monday-Friday: 9:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM",
    currentOccupancy: 8,
    trend: "up",
    trendPercentage: 10,
    waitingTime: "2 min",
    isLive: true,
    hourlyTrend: [4, 5, 6, 7, 6, 7, 8, 8],
    lastUpdated: new Date(Date.now() - 120 * 60000), // 120 minutes ago
  },
  {
    id: 7,
    name: "Matara City Branch",
    address: "12 Beach Road, Matara",
    openHours: "Monday-Friday: 9:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM",
    currentOccupancy: 14,
    trend: "up",
    trendPercentage: 8,
    waitingTime: "4 min",
    isLive: true,
    hourlyTrend: [7, 9, 10, 12, 14, 13, 14, 14],
    lastUpdated: new Date(Date.now() - 130 * 60000), // 130 minutes ago
  },
  {
    id: 8,
    name: "Kurunegala Mall",
    address: "45 Main Street, Kurunegala",
    openHours: "Monday-Sunday: 9:00 AM - 7:00 PM",
    currentOccupancy: 26,
    trend: "down",
    trendPercentage: 6,
    waitingTime: "7 min",
    isLive: true,
    hourlyTrend: [20, 25, 30, 35, 32, 28, 27, 26],
    lastUpdated: new Date(Date.now() - 140 * 60000), // 140 minutes ago
  },
  {
    id: 9,
    name: "Anuradhapura Center",
    address: "78 Temple Road, Anuradhapura",
    openHours: "Monday-Friday: 8:30 AM - 4:30 PM",
    currentOccupancy: 12,
    trend: "stable",
    trendPercentage: 2,
    waitingTime: "3 min",
    isLive: true,
    hourlyTrend: [12, 11, 13, 12, 13, 11, 12, 12],
    lastUpdated: new Date(Date.now() - 100 * 60000), // 100 minutes ago
  },
];

function App() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial API loading on first render
  useEffect(() => {
    // Simulate API fetch with a random loading time between 1-5 seconds
    // TODO: Remove this random timeout when connecting to the real API
    const loadingTime = Math.floor(Math.random() * 4000) + 1000; // 1-5 seconds

    console.log(`Initial data loading (${loadingTime}ms)...`);

    const timer = setTimeout(() => {
      // Initialize with mock data (will be replaced with API data)
      const initialData = mockLocations.map((loc) => ({
        ...loc,
        lastUpdated: new Date(
          Date.now() - Math.floor(Math.random() * 120) * 60000
        ), // Random time within last 2 hours
      }));

      setLocations(initialData);
      setFilteredLocations(initialData);
      setLastRefreshTime(new Date());
      setIsLoading(false);

      console.log("Initial data loaded");
    }, loadingTime);

    return () => clearTimeout(timer);
  }, []);

  // Filter locations based on search term or selected location
  useEffect(() => {
    if (!locations.length) return;

    if (selectedLocationId !== null) {
      const selected = locations.filter(
        (location) => location.id === selectedLocationId
      );
      setFilteredLocations(selected);
      setShowNoResults(selected.length === 0);
    } else if (searchTerm.trim() === "") {
      setFilteredLocations(locations);
      setShowNoResults(false);
    } else {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowNoResults(filtered.length === 0);
    }
  }, [searchTerm, locations, selectedLocationId]);

  // This would be replaced with an actual API call in production
  const refreshData = () => {
    console.log("Refreshing data...");
    setIsRefreshing(true);

    // TEMPORARY FOR TESTING: Random refresh time between 0.5 and 3 seconds
    // TODO: Remove this when connecting to real API
    const randomRefreshTime = Math.floor(Math.random() * 2500) + 500; // 0.5 to 3 seconds

    setTimeout(() => {
      // Simulate updated data by slightly changing the occupancy numbers
      const updatedLocations = locations.map((location) => {
        // Extract just the number from the waiting time string
        const waitingMinutes = parseInt(
          location.waitingTime.replace(/[^0-9]/g, "")
        );

        return {
          ...location,
          currentOccupancy: Math.max(
            1,
            Math.floor(location.currentOccupancy * (0.9 + Math.random() * 0.2))
          ),
          waitingTime: `${Math.max(
            1,
            Math.floor(waitingMinutes * (0.9 + Math.random() * 0.2))
          )} min`,
          lastUpdated: new Date(), // Update the timestamp
        };
      });

      setLocations(updatedLocations);
      setLastRefreshTime(new Date());
      setIsRefreshing(false);
    }, randomRefreshTime);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedLocationId(null);
  };

  const handleLocationSelect = (locationId: number) => {
    setSelectedLocationId(locationId);
    setSearchTerm(""); // Clear the search term when selecting a specific location
  };

  const handleResetSearch = () => {
    setSelectedLocationId(null);
    setSearchTerm("");
    setFilteredLocations(locations);
  };

  // Generate loading skeleton placeholders
  const renderSkeletons = () => {
    // Show 8 skeleton cards while loading
    return Array(8)
      .fill(0)
      .map((_, index) => <LoadingSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <div className={`dashboard ${isRefreshing ? "refreshing" : ""}`}>
      <Navbar
        onSearch={handleSearch}
        onRefresh={refreshData}
        onDisclaimerClick={() => setShowDisclaimer(true)}
        isRefreshing={isRefreshing}
        locations={locations}
        onLocationSelect={handleLocationSelect}
        selectedLocationId={selectedLocationId}
        onResetSearch={handleResetSearch}
      />

      <div className="dashboard-content">
        {isLoading ? (
          <div className="loading-container">{renderSkeletons()}</div>
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
              <LocationCard key={location.id} location={location} />
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
