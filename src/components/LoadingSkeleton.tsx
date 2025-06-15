import "../css/LoadingSkeleton.css";

type LoadingSkeletonProps = {
  type?: "card" | "row";
};

// This component renders loading skeletons for different parts of the app
const LoadingSkeleton = ({ type = "card" }: LoadingSkeletonProps) => {
  // Card skeleton for the dashboard
  if (type === "card") {
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
  }

  // Row skeleton for admin panel table
  if (type === "row") {
    return (
      <tr className="skeleton-row">
        <td>
          <div className="skeleton-cell skeleton-id"></div>
        </td>
        <td>
          <div className="skeleton-cell skeleton-name"></div>
        </td>
        <td>
          <div className="skeleton-cell skeleton-address"></div>
        </td>
        <td>
          <div className="skeleton-cell skeleton-status"></div>
        </td>
        <td>
          <div className="skeleton-cell skeleton-interval"></div>
        </td>
        <td>
          <div className="skeleton-cell skeleton-last-updated"></div>
        </td>
      </tr>
    );
  }

  return null;
};

export default LoadingSkeleton;
