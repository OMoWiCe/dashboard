import { useState, useEffect } from "react";
import "../css/Disclaimer.css";

interface DisclaimerProps {
  onClose: () => void;
}

const Disclaimer = ({ onClose }: DisclaimerProps) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    // Keep the countdown timer for informational purposes only
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up timer
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overlay">
      <div className="disclaimer-modal">
        <h2 className="disclaimer-title">Disclaimer</h2>
        <div className="disclaimer-content">
          <p>
            The occupancy data shown on this dashboard is collected through our
            sensor network and is provided for informational purposes only.
            While we strive to provide accurate and up-to-date information, we
            cannot guarantee the absolute accuracy of the data at all times.
          </p>
          <p>
            Factors such as sensor calibration, network issues, or maintenance
            activities may temporarily affect data accuracy. Please use this
            information as a general guide rather than for critical
            decision-making.
          </p>
          <p>
            By using this dashboard, you acknowledge that you understand these
            limitations. The indicators and waiting times are estimates based on
            historical patterns and current occupancy levels.
          </p>
          <p>This message will automatically close in {timeLeft} seconds.</p>
        </div>
        <button className="disclaimer-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;
