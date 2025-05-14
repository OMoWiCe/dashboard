import "../css/LoadingSkeleton.css";

// This component renders a simplified loading skeleton for location cards
const LoadingSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
      </div>

      <div className="skeleton-stats">
        <div className="skeleton-occupancy"></div>
        <div className="skeleton-waiting-time"></div>
      </div>

      <div className="skeleton-chart"></div>

      <div className="skeleton-updated"></div>
    </div>
  );
};

export default LoadingSkeleton;
