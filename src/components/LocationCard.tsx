import "../css/LocationCard.css";
import type { LocationWithMetrics } from "../types/api";
import { useEffect, useRef } from "react";

interface LocationProps {
  location: LocationWithMetrics;
  onCardClick: (locationId: string) => void;
  isExpanded: boolean;
  onClose?: () => void;
}

const LocationCard = ({
  location,
  onCardClick,
  isExpanded,
  onClose,
}: LocationProps) => {
  const {
    id,
    name,
    address,
    googleMapsUrl,
    openHours,
    currentOccupancy,
    trend,
    waitingTime,
    waitingTimeTrend,
    isLive,
    hourlyTrend,
    lastUpdated,
    updateInterval,
  } = location;

  // Reference to trend chart container
  const trendChartRef = useRef<HTMLDivElement>(null);

  // Ensure chart visibility after refresh
  useEffect(() => {
    if (isExpanded && trendChartRef.current) {
      // Force redraw of the chart by toggling display style briefly
      const chartElement = trendChartRef.current;
      chartElement.style.opacity = "0";
      setTimeout(() => {
        chartElement.style.opacity = "1";
      }, 50);
    }
  }, [isExpanded, hourlyTrend]);

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return "No update info";

    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / 60000
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    return lastUpdated.toLocaleString();
  };

  // Find the maximum value in the hourly trend to normalize the chart (only used if expanded)
  const maxTrend = hourlyTrend ? Math.max(...hourlyTrend, 1) : 1; // Ensure we don't divide by zero

  // Handle click on the entire card
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card expansion if user clicked on Google Maps link or close button
    if (
      (e.target as HTMLElement).closest(".location-map-btn") ||
      (e.target as HTMLElement).closest(".close-expanded-card")
    ) {
      e.stopPropagation();
      return;
    }

    onCardClick(id);
  };

  // Split the hourly trend into two rows of 12 hours each
  const firstHalfTrend = hourlyTrend ? hourlyTrend.slice(0, 12) : [];
  const secondHalfTrend = hourlyTrend ? hourlyTrend.slice(12, 24) : [];

  // Format hour for tooltip display
  const formatHour = (hour: number) => {
    return hour === 0
      ? "12 AM"
      : hour < 12
      ? `${hour} AM`
      : hour === 12
      ? "12 PM"
      : `${hour - 12} PM`;
  };

  return (
    <div
      className={`location-card ${isExpanded ? "expanded" : ""} ${
        isLive ? "live" : "offline"
      }`}
      onClick={handleCardClick}
      id={`card-${id}`}
    >
      {isExpanded && (
        <button
          className="close-expanded-card"
          onClick={(e) => {
            e.stopPropagation();
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onClose && onClose();
          }}
          aria-label="Close expanded card"
        >
          <i className="fa fa-times"></i>
        </button>
      )}

      <div className="location-header">
        <div className="location-info">
          <div className="location-top">
            <div>
              <h3 className="location-title">{name}</h3>
              <p className="location-address">{address}</p>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="location-map-btn"
              title="View on Google Maps"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fa fa-map-marker"></i>
            </a>
          </div>

          <div className="location-hours">
            {openHours}
            <div className="location-status">
              <span
                className={`status-indicator ${
                  isLive ? "status-live" : "status-offline"
                }`}
              ></span>
              <span className="status-text">
                {isLive ? "Live Data" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="location-stats">
        <div className="occupancy">
          <div className="occupancy-count">
            <span className="occupancy-number">{currentOccupancy}</span>
            {/* show a line if trend is stable */}
            {trend === "stable" && (
              <span className="occupancy-trend">
                <i className="fa fa-minus"></i>
              </span>
            )}
            {/* show an arrow if trend is up or down */}
            {trend !== "stable" && (
              <span
                className={`occupancy-trend ${
                  trend === "up" ? "trend-up" : "trend-down"
                }`}
              >
                <i className={`fa fa-arrow-${trend}`}></i>
              </span>
            )}
          </div>
          <div className="occupancy-label">People Nearby</div>
        </div>
        <div className="waiting-time-container">
          <div className="waiting-time">
            <div className="waiting-time-value-container">
              <p className="waiting-time-value">{waitingTime}</p>
              {/* If waitingTime is "-" then don't show the trend */}
              {/* show a line if waiting time trend is stable */}
              {waitingTime !== "-" && waitingTimeTrend === "stable" && (
                <span className="waiting-time-trend">
                  <i className="fa fa-minus"></i>
                </span>
              )}
              {/* show an arrow if waiting time trend is up or down */}
              {waitingTime !== "-" && waitingTimeTrend !== "stable" && (
                <span
                  className={`waiting-time-trend ${
                    waitingTimeTrend === "up" ? "trend-up" : "trend-down"
                  }`}
                >
                  <i className={`fa fa-arrow-${waitingTimeTrend}`}></i>
                </span>
              )}
            </div>
            <span className="waiting-time-label">Avg. Waiting Time</span>
          </div>
        </div>
      </div>

      {/* Trend chart is only shown when card is expanded */}
      {isExpanded && hourlyTrend && hourlyTrend.length > 0 && (
        <div className="trend-charts" ref={trendChartRef}>
          <div className="trend-title">Occupancy Trend (Last 24 Hours)</div>

          {/* First row: Hours 0-11 (12am-11am) */}
          <div className="trend-row">
            <div className="trend-bars">
              {firstHalfTrend.map((value, index) => (
                <div
                  key={`first-${index}`}
                  className="trend-bar"
                  style={{
                    height: `${(value / maxTrend) * 100}%`,
                  }}
                  data-tooltip={`${formatHour(index)}: Avg. ${value} People`}
                ></div>
              ))}
            </div>
            <div className="trend-labels">
              <span>00:00</span>
              <span>03:00</span>
              <span>06:00</span>
              <span>09:00</span>
              <span>11:00</span>
            </div>
          </div>

          {/* Second row: Hours 12-23 (12pm-11pm) */}
          <div className="trend-row">
            <div className="trend-bars">
              {secondHalfTrend.map((value, index) => (
                <div
                  key={`second-${index}`}
                  className={`trend-bar ${
                    index + 12 === hourlyTrend.length - 1 ? "current" : ""
                  }`}
                  style={{
                    height: `${(value / maxTrend) * 100}%`,
                  }}
                  data-tooltip={`${formatHour(
                    index + 12
                  )}: Avg. ${value} People`}
                ></div>
              ))}
            </div>
            <div className="trend-labels">
              <span>12:00</span>
              <span>15:00</span>
              <span>18:00</span>
              <span>21:00</span>
              <span>23:00</span>
            </div>
          </div>
        </div>
      )}

      <div className="card-footer">
        <div className="update-interval">
          {/* add (s) if more than 1 */}
          Updates: Every {updateInterval} min{updateInterval > 1 ? "s" : ""}
        </div>
        <div className="last-updated">Last updated: {formatLastUpdated()}</div>
      </div>

      {!isExpanded && (
        <div className="card-click-hint">
          <i className="fa fa-info-circle"></i> Click for Details
        </div>
      )}
    </div>
  );
};

export default LocationCard;
