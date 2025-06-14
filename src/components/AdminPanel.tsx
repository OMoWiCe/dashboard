import { useState, useEffect } from "react";
import "../css/AdminPanel.css";
import "../css/theme.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdminLocationModal from "./AdminLocationModal";
import LoadingSkeleton from "./LoadingSkeleton";
import Disclaimer from "./Disclaimer";
import { adminApi } from "../utils/adminApi";
import type { Location } from "../types/api";
import type { LocationWithStatus } from "../types/admin";

function AdminPanel() {
  // State management
  const [locations, setLocations] = useState<LocationWithStatus[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<
    LocationWithStatus[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof LocationWithStatus>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // UI state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationWithStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  // Fetch all locations on initial load
  useEffect(() => {
    fetchLocations();
  }, []);

  // Filter and sort locations when search term or sort options change
  useEffect(() => {
    let filtered = locations;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.locationId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortDirection === "asc" ? comparison : -comparison;
      }

      return 0;
    });

    setFilteredLocations(filtered);
  }, [locations, searchTerm, sortField, sortDirection]);
  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const locationsData = await adminApi.getAllLocations();

      // Try to fetch metrics to determine status, but don't fail if it's not available
      let metricsData: any[] = [];
      try {
        // Import the main API dynamically to avoid circular dependencies
        const { api } = await import("../utils/api");
        metricsData = await api.getAllMetrics();
      } catch (metricsError) {
        console.warn(
          "Could not fetch metrics for status determination:",
          metricsError
        );
      }

      // Transform data to include status and formatting
      const locationsWithStatus: LocationWithStatus[] = locationsData.map(
        (location: Location) => {
          // Find matching metrics to determine status
          const metrics = metricsData.find(
            (m: any) => m.locationId === location.locationId
          );

          // Determine status based on metrics
          let status: "online" | "offline" = "offline";
          let lastActive = new Date();
          let updateInterval = 60;

          if (metrics) {
            const now = new Date();
            const lastUpdated = new Date(metrics.lastUpdated);
            const diffInMinutes =
              (now.getTime() - lastUpdated.getTime()) / 60000;

            // Consider online if updated within 5 times the update interval
            status =
              diffInMinutes < metrics.updateInterval * 5 ? "online" : "offline";
            lastActive = lastUpdated;
            updateInterval = metrics.updateInterval;
          } else {
            // Default to some reasonable defaults if no metrics available
            status = "offline";
            lastActive = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago as placeholder
          }

          return {
            ...location,
            status,
            lastActive,
            updateInterval,
          };
        }
      );

      setLocations(locationsWithStatus);
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to load locations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchLocations();
    setIsRefreshing(false);
  };
  // This handles search term changes immediately without requiring Enter key
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (field: keyof LocationWithStatus) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (location: LocationWithStatus) => {
    setSelectedLocation(location);
    setShowModal(true);
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
  };

  const handleLocationSaved = () => {
    fetchLocations(); // Refresh the list
    handleCloseModal();
  };

  const handleLocationDeleted = () => {
    fetchLocations(); // Refresh the list
    handleCloseModal();
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    return date.toLocaleString();
  };

  const getSortIcon = (field: keyof LocationWithStatus) => {
    if (sortField !== field) return "fa-sort";
    return sortDirection === "asc" ? "fa-sort-up" : "fa-sort-down";
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => <LoadingSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <div className={`admin-panel ${isRefreshing ? "refreshing" : ""}`}>
      {" "}
      <Navbar
        onSearch={handleSearch}
        onRefresh={refreshData}
        onDisclaimerClick={() => setShowDisclaimer(true)}
        isRefreshing={isRefreshing}
        locations={locations}
        onLocationSelect={() => {}} // Not used in admin panel
        selectedLocationId={null}
        onResetSearch={() => setSearchTerm("")}
        isAdminPage={true}
      />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Admin Panel</h1>
          <div className="admin-actions">
            <button className="add-location-btn" onClick={handleAddLocation}>
              <i className="fa fa-plus" aria-hidden="true"></i>
              Add Location
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">{renderSkeletons()}</div>
        ) : error ? (
          <div className="error-message">
            <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
            <div>{error}</div>
            <button onClick={refreshData} className="refresh-btn">
              Try Again
            </button>
          </div>
        ) : (
          <div className="locations-table-container">
            {filteredLocations.length !== 0 && (
              <table className="locations-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("locationId")}>
                      ID{" "}
                      <i
                        className={`fa ${getSortIcon("locationId")}`}
                        aria-hidden="true"
                      ></i>
                    </th>
                    <th onClick={() => handleSort("name")}>
                      Name{" "}
                      <i
                        className={`fa ${getSortIcon("name")}`}
                        aria-hidden="true"
                      ></i>
                    </th>
                    <th onClick={() => handleSort("address")}>
                      Address{" "}
                      <i
                        className={`fa ${getSortIcon("address")}`}
                        aria-hidden="true"
                      ></i>
                    </th>
                    <th onClick={() => handleSort("status")}>
                      Status{" "}
                      <i
                        className={`fa ${getSortIcon("status")}`}
                        aria-hidden="true"
                      ></i>
                    </th>
                    <th onClick={() => handleSort("updateInterval")}>
                      Update Interval{" "}
                      <i
                        className={`fa ${getSortIcon("updateInterval")}`}
                        aria-hidden="true"
                      ></i>
                    </th>
                    <th onClick={() => handleSort("lastActive")}>
                      Last Updated{" "}
                      <i
                        className={`fa ${getSortIcon("lastActive")}`}
                        aria-hidden="true"
                      ></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.map((location) => (
                    <tr
                      key={location.locationId}
                      onClick={() => handleRowClick(location)}
                      className="table-row"
                    >
                      <td>{location.locationId}</td>
                      <td>{location.name}</td>
                      <td>{location.address}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            location.status === "online"
                              ? "status-online"
                              : "status-offline"
                          }`}
                        >
                          {location.status}
                        </span>
                      </td>
                      <td>{location.updateInterval} min</td>
                      <td>{formatLastActive(location.lastActive)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filteredLocations.length === 0 && !isLoading && (
              <div className="no-results-message">
                <i className="fa fa-search-minus" aria-hidden="true"></i>
                <div>No locations found!</div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer lastRefreshTime={lastRefreshTime} />
      {showModal && (
        <AdminLocationModal
          location={selectedLocation}
          onClose={handleCloseModal}
          onSaved={handleLocationSaved}
          onDeleted={handleLocationDeleted}
        />
      )}
      {showDisclaimer && (
        <Disclaimer onClose={() => setShowDisclaimer(false)} />
      )}
    </div>
  );
}

export default AdminPanel;
