import "../css/LocationCard.css";

interface LocationProps {
  location: {
    id: number;
    name: string;
    address: string;
    openHours: string;
    currentOccupancy: number;
    trend: string;
    trendPercentage: number;
    waitingTime: string;
    isLive: boolean;
    hourlyTrend: number[];
    lastUpdated?: Date; // New field for last updated timestamp
  };
}

const LocationCard = ({ location }: LocationProps) => {
  const {
    name,
    address,
    openHours,
    currentOccupancy,
    trend,
    trendPercentage,
    waitingTime,
    isLive,
    hourlyTrend,
    lastUpdated,
  } = location;

  // Find the maximum value in the hourly trend to normalize the chart
  const maxTrend = Math.max(...hourlyTrend);

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

  return (
    <div className="location-card">
      <div className="location-header">
        <div className="location-info">
          <h3 className="location-title">{name}</h3>
          <p className="location-address">{address}</p>
          <div className="location-status">
            <span
              className={`status-indicator ${
                isLive ? "status-live" : "status-offline"
              }`}
            ></span>
            <span className="status-text">
              {isLive ? "Live data" : "Offline"}
            </span>
          </div>
        </div>
        <button className="location-map-btn" title="View on map">
          <i className="fa fa-map-marker"></i>
        </button>
      </div>

      <div className="location-hours">{openHours}</div>

      <div className="location-stats">
        <div className="occupancy">
          <div className="occupancy-count">
            <span className="occupancy-number">{currentOccupancy}</span>
            {trend !== "stable" && (
              <span
                className={`occupancy-trend ${
                  trend === "up" ? "trend-up" : "trend-down"
                }`}
              >
                <i className={`fa fa-arrow-${trend}`}></i>
                {trendPercentage}%
              </span>
            )}
          </div>
          <div className="occupancy-label">People currently inside</div>
        </div>

        <div className="waiting-time">
          <p className="waiting-time-value">{waitingTime}</p>
          <span className="waiting-time-label">Avg. waiting time</span>
        </div>
      </div>

      <div className="trend-charts">
        <div className="trend-title">Occupancy trend (last 8 hours)</div>
        <div className="trend-bars">
          {hourlyTrend.map((value, index) => (
            <div
              key={index}
              className={`trend-bar ${
                index === hourlyTrend.length - 1 ? "current" : ""
              }`}
              style={{
                height: `${(value / maxTrend) * 100}%`,
              }}
            ></div>
          ))}
        </div>
        <div className="trend-labels">
          <span>-8h</span>
          <span>-6h</span>
          <span>-4h</span>
          <span>-2h</span>
          <span>Now</span>
        </div>
      </div>

      <div className="last-updated">Last updated: {formatLastUpdated()}</div>
    </div>
  );
};

export default LocationCard;
