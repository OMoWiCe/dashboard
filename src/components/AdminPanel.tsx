import { useState, useEffect } from "react";
import "../css/AdminPanel.css";
import "../css/theme.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdminLocationModal from "./AdminLocationModal";
import AdminLogin from "./AdminLogin";
import LoadingSkeleton from "./LoadingSkeleton";
import Disclaimer from "./Disclaimer";
import { adminApi } from "../utils/adminApi";
import { convertToStandardTimezone } from "../utils/dataTransformers";
import type { Location } from "../types/api";
import type { LocationWithStatus } from "../types/admin";

// Extend the Location type to include the fields from the API response
interface ExtendedLocation extends Location {
  lastMetricUpdated?: string;
  updateInterval?: number;
  lastRecordUpdated?: string;
  avgDevicesPerPerson?: number;
  avgSimsPerPerson?: number;
  wifiUsageRatio?: number;
  cellularUsageRatio?: number;
}
import { ToastProvider } from "../contexts/ToastContext";

function AdminPanel() {
  // Authentication state - check localStorage on initialization
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("adminAuthenticated") === "true";
  });

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
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null); // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("adminAuthenticated", "true");
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const locationsData = await adminApi.getAllLocations();
      // Transform data to include status and formatting
      const locationsWithStatus: LocationWithStatus[] = locationsData.map(
        (location: ExtendedLocation) => {
          // Determine status based on lastMetricUpdated
          const now = new Date();
          let status: "online" | "offline" = "offline";

          // Use the lastMetricUpdated field from the API response
          const lastMetricUpdated = location.lastMetricUpdated
            ? convertToStandardTimezone(location.lastMetricUpdated)
            : null;

          // Get update interval from the API response or use default
          const updateInterval = location.updateInterval || 60;

          if (lastMetricUpdated) {
            const diffInMinutes =
              (now.getTime() - lastMetricUpdated.getTime()) / 60000;

            // Consider online if updated within 5 times the update interval
            status = diffInMinutes < updateInterval * 5 ? "online" : "offline";
          }

          return {
            ...location,
            status,
            lastActive: lastMetricUpdated || new Date(0),
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

  // Fetch all locations on initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchLocations();
    }
  }, [isAuthenticated]);

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
  }, [locations, searchTerm, sortField, sortDirection]); // This handles search term changes immediately without requiring Enter key
  const handleSearch = (term: string) => {
    if (!isAuthenticated) return; // Prevent search when not authenticated
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
    // Check if date is epoch (Jan 1, 1970) which we use to indicate never updated
    if (date.getTime() === 0) return "Never";

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
  // Render loading skeletons for the admin panel table
  const renderSkeletons = () => {
    return (
      <table className="locations-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>
              ID <i className="fa fa-sort sort-hidden" aria-hidden="true"></i>
            </th>
            <th style={{ width: "23%" }}>
              Name <i className="fa fa-sort sort-hidden" aria-hidden="true"></i>
            </th>
            <th style={{ width: "32%" }}>
              Address{" "}
              <i className="fa fa-sort sort-hidden" aria-hidden="true"></i>
            </th>
            <th style={{ width: "8%" }}>
              Status{" "}
              <i className="fa fa-sort sort-hidden" aria-hidden="true"></i>
            </th>
            <th style={{ width: "12%" }}>
              Update Interval{" "}
              <i className="fa fa-sort sort-hidden" aria-hidden="true"></i>
            </th>
            <th style={{ width: "15%" }}>
              Last Updated{" "}
              <i className="fa fa-sort sort-hidden" aria-hidden="true"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <LoadingSkeleton key={`skeleton-${index}`} type="row" />
            ))}
        </tbody>
      </table>
    );
  };
  return (
    <ToastProvider>
      <div className={`admin-panel ${isRefreshing ? "refreshing" : ""}`}>
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

        {!isAuthenticated ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="admin-content">
            {" "}
            <div className="admin-header">
              <h1 className="admin-title">Admin Panel</h1>
              <div className="admin-actions">
                <button
                  className="add-location-btn"
                  onClick={handleAddLocation}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i>
                  Add Location
                </button>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  Logout
                </button>
              </div>
            </div>{" "}
            {isLoading ? (
              <div
                className="loading-container-admin"
                style={{ width: "100%", overflowX: "hidden" }}
              >
                {renderSkeletons()}
              </div>
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
                {" "}
                {filteredLocations.length !== 0 && (
                  <table className="locations-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th
                          style={{ width: "10%" }}
                          onClick={() => handleSort("locationId")}
                        >
                          ID{" "}
                          <i
                            className={`fa ${getSortIcon("locationId")}`}
                            aria-hidden="true"
                          ></i>
                        </th>
                        <th
                          style={{ width: "23%" }}
                          onClick={() => handleSort("name")}
                        >
                          Name{" "}
                          <i
                            className={`fa ${getSortIcon("name")}`}
                            aria-hidden="true"
                          ></i>
                        </th>
                        <th
                          style={{ width: "32%" }}
                          onClick={() => handleSort("address")}
                        >
                          Address{" "}
                          <i
                            className={`fa ${getSortIcon("address")}`}
                            aria-hidden="true"
                          ></i>
                        </th>
                        <th
                          style={{ width: "8%" }}
                          onClick={() => handleSort("status")}
                        >
                          Status{" "}
                          <i
                            className={`fa ${getSortIcon("status")}`}
                            aria-hidden="true"
                          ></i>
                        </th>
                        <th
                          style={{ width: "12%" }}
                          onClick={() => handleSort("updateInterval")}
                        >
                          Update Interval{" "}
                          <i
                            className={`fa ${getSortIcon("updateInterval")}`}
                            aria-hidden="true"
                          ></i>
                        </th>
                        <th
                          style={{ width: "15%" }}
                          onClick={() => handleSort("lastActive")}
                        >
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
        )}

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
    </ToastProvider>
  );
}

export default AdminPanel;
