import { useState, useRef, useEffect } from "react";
import "../css/Navbar.css";

interface NavbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onDisclaimerClick: () => void;
  isRefreshing?: boolean;
}

const Navbar = ({
  onSearch,
  onRefresh,
  onDisclaimerClick,
  isRefreshing = false,
}: NavbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const [manualRefreshCooldown, setManualRefreshCooldown] = useState(false);
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

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

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleManualRefresh = () => {
    if (!manualRefreshCooldown) {
      onRefresh();
      setManualRefreshCooldown(true);
      setRefreshCooldown(30);
    }
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
          <a
            href="https://www.omowice.live"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            OMoWiCe
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
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search locations..."
              value={searchValue}
              onChange={handleSearch}
            />
            <span className="search-icon">
              <i className="fa fa-search" aria-hidden="true"></i>
            </span>
          </div>
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
              {autoRefreshInterval
                ? `Auto (${autoRefreshInterval}s)`
                : "Auto refresh"}
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
                  onClick={() => setRefreshInterval(10)}
                >
                  10 seconds
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => setRefreshInterval(30)}
                >
                  30 seconds
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => setRefreshInterval(60)}
                >
                  1 minute
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
