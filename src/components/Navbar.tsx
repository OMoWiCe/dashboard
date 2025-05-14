import { useState, useRef, useEffect } from "react";
import "../css/Navbar.css";

// Auto-refresh options - easier to modify later
const AUTO_REFRESH_OPTIONS = {
  ONE_MIN: 60,
  FIVE_MIN: 300,
  TEN_MIN: 600,
  THIRTY_MIN: 1800,
  ONE_HOUR: 3600,
};

// Default auto-refresh interval (1 minute)
const DEFAULT_AUTO_REFRESH = AUTO_REFRESH_OPTIONS.ONE_MIN;

interface NavbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onDisclaimerClick: () => void;
  isRefreshing?: boolean;
  locations: Array<{
    id: number;
    name: string;
    address: string;
  }>;
  onLocationSelect: (locationId: number) => void;
  selectedLocationId: number | null;
  onResetSearch: () => void;
}

const Navbar = ({
  onSearch,
  onRefresh,
  onDisclaimerClick,
  isRefreshing = false,
  locations,
  onLocationSelect,
  selectedLocationId,
  onResetSearch,
}: NavbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number | null>(
    DEFAULT_AUTO_REFRESH
  );
  const [searchValue, setSearchValue] = useState("");
  const [manualRefreshCooldown, setManualRefreshCooldown] = useState(false);
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  // Filter locations based on search input
  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredLocations([]);
      setShowSearchDropdown(false);
      return;
    }

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    // Show loading animation
    setIsSearching(true);

    // Simulate API delay
    searchTimeoutRef.current = window.setTimeout(() => {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          location.address.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSearchDropdown(true);
      setIsSearching(false);
    }, 300); // Simulate a short delay for the search animation
  }, [searchValue, locations]);

  // Handle auto-refresh interval changes
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoRefreshInterval) {
      intervalRef.current = window.setInterval(() => {
        // Auto-refresh should not trigger the cooldown
        onRefresh();
      }, autoRefreshInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefreshInterval, onRefresh]);

  // Handle refresh cooldown timer
  useEffect(() => {
    let timer: number | null = null;

    if (refreshCooldown > 0) {
      timer = window.setInterval(() => {
        setRefreshCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer as number);
            setManualRefreshCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [refreshCooldown]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle auto-refresh dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }

      // Handle search dropdown
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setRefreshInterval = (seconds: number | null) => {
    setAutoRefreshInterval(seconds);
    setShowDropdown(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch("");
    setShowSearchDropdown(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleManualRefresh = () => {
    if (!manualRefreshCooldown) {
      onRefresh();
      setManualRefreshCooldown(true);
      setRefreshCooldown(30);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    onSearch(searchValue);
    setShowSearchDropdown(false);
  };

  const handleLocationSelect = (locationId: number) => {
    onLocationSelect(locationId);
    setShowSearchDropdown(false);
    setSearchValue(""); // Clear search field after selection
  };

  // Format the auto-refresh interval for display
  const formatAutoRefreshDisplay = () => {
    if (!autoRefreshInterval) return "Auto refresh";

    if (autoRefreshInterval === AUTO_REFRESH_OPTIONS.ONE_MIN)
      return "Auto (1min)";
    if (autoRefreshInterval === AUTO_REFRESH_OPTIONS.FIVE_MIN)
      return "Auto (5min)";
    if (autoRefreshInterval === AUTO_REFRESH_OPTIONS.TEN_MIN)
      return "Auto (10min)";
    if (autoRefreshInterval === AUTO_REFRESH_OPTIONS.THIRTY_MIN)
      return "Auto (30min)";
    if (autoRefreshInterval === AUTO_REFRESH_OPTIONS.ONE_HOUR)
      return "Auto (1h)";

    return `Auto (${autoRefreshInterval}s)`;
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a href="" target="_blank" className="navbar-logo">
            <img
              src="/icons/black-fav.png"
              alt="Logo"
              className="navbar-logo-img"
            />
          </a>
          <a href="/" className="navbar-link">
            Dashboard
          </a>
          <a
            href="https://github.com/OMoWiCe/azfunc-api"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            API Docs
          </a>
          <a
            href="#"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              onDisclaimerClick();
            }}
          >
            Disclaimer
          </a>
        </div>

        <div className="navbar-center">
          <form
            className={`search-container ${isSearching ? "searching" : ""}`}
            onSubmit={handleSearchSubmit}
          >
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search locations..."
              value={searchValue}
              onChange={handleSearchInputChange}
              onFocus={() => {
                if (searchValue && filteredLocations.length > 0) {
                  setShowSearchDropdown(true);
                }
              }}
            />
            <span className="search-icon">
              {isSearching ? (
                <i
                  className="fa fa-circle-o-notch fa-spin"
                  aria-hidden="true"
                ></i>
              ) : (
                <i className="fa fa-search" aria-hidden="true"></i>
              )}
            </span>

            <span
              className={`clear-icon ${searchValue ? "visible" : ""}`}
              onClick={handleClearSearch}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </span>

            <button
              type="submit"
              className="search-btn"
              onClick={() => handleSearchSubmit()}
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>

            {showSearchDropdown && filteredLocations.length > 0 && (
              <div
                className={`search-dropdown ${
                  showSearchDropdown ? "visible" : ""
                }`}
                ref={searchDropdownRef}
              >
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="search-dropdown-item"
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className="location-name">{location.name}</div>
                    <div className="location-address">{location.address}</div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {selectedLocationId !== null && (
            <button
              className="reset-search-btn"
              onClick={onResetSearch}
              title="Clear search and show all locations"
            >
              Clear
            </button>
          )}
        </div>

        <div className="navbar-right">
          <button
            className={`refresh-btn ${
              manualRefreshCooldown ? "refresh-btn-disabled" : ""
            } ${isRefreshing ? "refreshing" : ""}`}
            onClick={handleManualRefresh}
            disabled={manualRefreshCooldown || isRefreshing}
            title={
              manualRefreshCooldown
                ? `Refresh available in ${refreshCooldown}s`
                : "Refresh data"
            }
          >
            <i className="fa fa-refresh" aria-hidden="true"></i>
            {isRefreshing
              ? "Refreshing..."
              : manualRefreshCooldown
              ? `Wait (${refreshCooldown}s)`
              : "Refresh"}
          </button>

          <div className="auto-refresh" ref={dropdownRef}>
            <button
              className="auto-refresh-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {formatAutoRefreshDisplay()}
              <i
                className="fa fa-chevron-down"
                aria-hidden="true"
                style={{ marginLeft: "6px" }}
              ></i>
            </button>

            {showDropdown && (
              <div className="auto-refresh-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => setRefreshInterval(null)}
                >
                  Off
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.ONE_MIN)
                  }
                >
                  1 minute
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.FIVE_MIN)
                  }
                >
                  5 minutes
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.TEN_MIN)
                  }
                >
                  10 minutes
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.THIRTY_MIN)
                  }
                >
                  30 minutes
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.ONE_HOUR)
                  }
                >
                  1 hour
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
