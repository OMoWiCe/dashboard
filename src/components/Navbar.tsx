import { useState, useRef, useEffect } from "react";
import "../css/Navbar.css";
import type { Location } from "../types/api";

const AUTO_REFRESH_OPTIONS = {
  ONE_MIN: 60,
  FIVE_MIN: 300,
  TEN_MIN: 600,
  THIRTY_MIN: 1800,
  ONE_HOUR: 3600,
};

const DEFAULT_AUTO_REFRESH = AUTO_REFRESH_OPTIONS.ONE_MIN;

interface NavbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onDisclaimerClick: () => void;
  isRefreshing?: boolean;
  locations: Location[];
  onLocationSelect: (locationId: string) => void;
  selectedLocationId: string | null;
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
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredLocations([]);
      setShowSearchDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);

    searchTimeoutRef.current = window.setTimeout(() => {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          location.address.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSearchDropdown(true);
      setIsSearching(false);
    }, 300);
  }, [searchValue, locations]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoRefreshInterval) {
      intervalRef.current = window.setInterval(() => {
        onRefresh();
      }, autoRefreshInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefreshInterval, onRefresh]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }

      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }

      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowMobileSearch(false);
      }

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).classList.contains("mobile-menu-btn") &&
        !(event.target as Element).closest(".mobile-menu-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const setRefreshInterval = (seconds: number | null) => {
    setAutoRefreshInterval(seconds);
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch("");
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
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
    setShowMobileSearch(false);
  };

  const handleLocationSelect = (locationId: string) => {
    onLocationSelect(locationId);
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
    setSearchValue("");
  };

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setShowMobileSearch(false);
    }
  };

  const handleMobileSearchClick = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setMobileMenuOpen(false);
    }
  };

  const handleMobileLinkClick = (callback: () => void) => {
    callback();
    setMobileMenuOpen(false);
  };

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

  const renderRefreshButtonContent = () => {
    if (isRefreshing) {
      return (
        <>
          <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
          {!isMobile && <span>Refreshing...</span>}
        </>
      );
    } else if (manualRefreshCooldown) {
      return (
        <>
          <i className="fa fa-refresh" aria-hidden="true"></i>
          {isMobile ? (
            <span className="mobile-cooldown">{refreshCooldown}</span>
          ) : (
            <span>Wait ({refreshCooldown}s)</span>
          )}
        </>
      );
    } else {
      return (
        <>
          <i className="fa fa-refresh" aria-hidden="true"></i>
          {!isMobile && <span>Refresh</span>}
        </>
      );
    }
  };

  if (isMobile) {
    return (
      <div className="navbar mobile-navbar">
        <div className="navbar-container mobile-container">
          <div className="mobile-navbar-left">
            <a href="" className="navbar-logo">
              <img
                src="/icons/black-fav.png"
                alt="Logo"
                className="navbar-logo-img"
              />
            </a>
          </div>

          <div className="mobile-navbar-actions">
            <button
              className="mobile-search-btn"
              onClick={handleMobileSearchClick}
              aria-label="Search"
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>

            <button
              className={`mobile-refresh-btn ${
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
              {renderRefreshButtonContent()}
            </button>

            <button
              className="mobile-menu-btn"
              onClick={handleMobileMenuClick}
              aria-label="Menu"
            >
              <i
                className={`fa ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>

        {mobileMenuOpen && <div className="mobile-menu-overlay"></div>}

        {mobileMenuOpen && (
          <div className="mobile-menu-dropdown" ref={mobileMenuRef}>
            <div className="mobile-menu-close">
              <button
                className="mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
            <a
              href="/"
              className="mobile-menu-item"
              onClick={(e) => {
                e.preventDefault();
                handleMobileLinkClick(() => (window.location.href = "/"));
              }}
            >
              <i className="fa fa-tachometer" aria-hidden="true"></i>
              Dashboard
            </a>
            <a
              href="https://github.com/OMoWiCe/azfunc-api"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fa fa-code" aria-hidden="true"></i>
              API Docs
            </a>
            <a
              href="#"
              className="mobile-menu-item"
              onClick={(e) => {
                e.preventDefault();
                handleMobileLinkClick(onDisclaimerClick);
              }}
            >
              <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
              Disclaimer
            </a>

            <div className="mobile-menu-section">
              <div className="mobile-menu-section-title">
                Auto Refresh Settings
              </div>
              <div className="refresh-settings">
                <div
                  className={`mobile-menu-item refresh-time ${
                    autoRefreshInterval === null ? "active" : ""
                  }`}
                  onClick={() => setRefreshInterval(null)}
                >
                  Off
                </div>
                <div
                  className={`mobile-menu-item refresh-time ${
                    autoRefreshInterval === AUTO_REFRESH_OPTIONS.ONE_MIN
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.ONE_MIN)
                  }
                >
                  1 min
                </div>
                <div
                  className={`mobile-menu-item refresh-time ${
                    autoRefreshInterval === AUTO_REFRESH_OPTIONS.FIVE_MIN
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.FIVE_MIN)
                  }
                >
                  5 mins
                </div>
                <div
                  className={`mobile-menu-item refresh-time ${
                    autoRefreshInterval === AUTO_REFRESH_OPTIONS.TEN_MIN
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.TEN_MIN)
                  }
                >
                  10 mins
                </div>
                <div
                  className={`mobile-menu-item refresh-time ${
                    autoRefreshInterval === AUTO_REFRESH_OPTIONS.THIRTY_MIN
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.THIRTY_MIN)
                  }
                >
                  30 mins
                </div>
                <div
                  className={`mobile-menu-item refresh-time ${
                    autoRefreshInterval === AUTO_REFRESH_OPTIONS.ONE_HOUR
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setRefreshInterval(AUTO_REFRESH_OPTIONS.ONE_HOUR)
                  }
                >
                  1 hour
                </div>
              </div>
            </div>
          </div>
        )}

        {showMobileSearch && (
          <div className="mobile-search-popup" ref={mobileSearchRef}>
            <form
              className={`mobile-search-container ${
                isSearching ? "searching" : ""
              }`}
              onSubmit={handleSearchSubmit}
            >
              <input
                ref={searchInputRef}
                type="text"
                className="mobile-search-input"
                placeholder="Search locations..."
                value={searchValue}
                onChange={handleSearchInputChange}
                autoFocus
              />
              <span className="mobile-search-icon">
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
                className={`mobile-clear-icon ${searchValue ? "visible" : ""}`}
                onClick={handleClearSearch}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </span>
            </form>

            {showSearchDropdown && filteredLocations.length > 0 && (
              <div className="mobile-search-dropdown">
                {filteredLocations.map((location) => (
                  <div
                    key={location.locationId}
                    className="mobile-search-dropdown-item"
                    onClick={() => handleLocationSelect(location.locationId)}
                  >
                    <div className="location-name">{location.name}</div>
                    <div className="location-address">{location.address}</div>
                  </div>
                ))}
              </div>
            )}

            {showSearchDropdown &&
              filteredLocations.length === 0 &&
              searchValue.trim() !== "" && (
                <div className="mobile-search-dropdown">
                  <div className="mobile-search-no-results">
                    No results found
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a href="" className="navbar-logo">
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
                    key={location.locationId}
                    className="search-dropdown-item"
                    onClick={() => handleLocationSelect(location.locationId)}
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
            {renderRefreshButtonContent()}
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
