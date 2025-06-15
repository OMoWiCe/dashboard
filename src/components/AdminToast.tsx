import { useEffect, useState } from "react";
import "../css/AdminToast.css";

export type ToastType = "error" | "success" | "info" | "confirm";

export interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number; // duration in seconds, undefined for permanent toasts
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  showConfirmation?: boolean;
}

const AdminToast = ({
  message,
  type,
  duration = 7, // default to 7 seconds
  onClose,
  onConfirm,
  onCancel,
  showConfirmation = false,
}: ToastProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // If it's not a confirmation toast and has a duration, set up the auto-close timer
    if (!showConfirmation && duration) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timer);
            // Trigger exit animation before closing
            setIsVisible(false);
            setTimeout(onClose, 300); // Match this with CSS transition time
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [duration, onClose, showConfirmation]);

  const getIconClass = () => {
    switch (type) {
      case "error":
        return "fa fa-exclamation-circle";
      case "success":
        return "fa fa-check-circle";
      case "confirm":
        return "fa fa-question-circle";
      default:
        return "fa fa-info-circle";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div className={`admin-toast ${type} ${isVisible ? "visible" : ""}`}>
      <div className="toast-content">
        <i className={getIconClass()} aria-hidden="true"></i>
        <div className="toast-message">{message}</div>
        {!showConfirmation && (
          <button className="toast-close" onClick={() => handleCancel()}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {showConfirmation && (
        <div className="toast-actions">
          <button className="confirm-btn" onClick={handleConfirm}>
            Yes, Delete
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}

      {!showConfirmation && duration && (
        <div className="toast-progress">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AdminToast;
