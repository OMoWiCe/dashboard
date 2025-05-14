import { useState, useEffect } from "react";
import "../css/App.css";
import "../css/theme.css";
import "../css/Dashboard.css";
import Navbar from "./Navbar";
import LocationCard from "./LocationCard";
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
];

function App() {
  const [locations, setLocations] = useState(
    mockLocations.map((loc) => ({
      ...loc,
      lastUpdated: new Date(
        Date.now() - Math.floor(Math.random() * 120) * 60000
      ), // Random time within last 2 hours
    }))
  );
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  // Filter locations based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

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

  // Format the last refresh time
  const formatLastRefresh = () => {
    if (!lastRefreshTime) return "";
    return `Last refreshed: ${lastRefreshTime.toLocaleTimeString()}`;
  };

  return (
    <div className={`dashboard ${isRefreshing ? "refreshing" : ""}`}>
      <Navbar
        onSearch={setSearchTerm}
        onRefresh={refreshData}
        onDisclaimerClick={() => setShowDisclaimer(true)}
        isRefreshing={isRefreshing}
      />

      <div className="dashboard-content">
        <div className="refresh-info">{formatLastRefresh()}</div>
        <div className="location-grid">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>

      <Footer />

      {showDisclaimer && (
        <Disclaimer onClose={() => setShowDisclaimer(false)} />
      )}
    </div>
  );
}

export default App;
