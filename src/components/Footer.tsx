import "../css/Footer.css";
import { useEffect, useState } from "react";

interface FooterProps {
  lastRefreshTime: Date | null;
}

const Footer = ({ lastRefreshTime }: FooterProps) => {
  // Add a state to track mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Format the last refresh time
  const formatLastRefresh = () => {
    if (!lastRefreshTime) return "Not refreshed yet";
    return `Last refreshed: ${lastRefreshTime.toLocaleTimeString()}`;
  };

  if (isMobile) {
    return (
      <footer className="footer mobile-footer">
        <div className="refresh-timestamp mobile-refresh">
          {formatLastRefresh()}
        </div>
        <div className="footer-mobile-row">
          <div className="footer-left">
            <span>© 2025 OMoWiCe</span>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-right">
            <a
              href="https://www.omowice.live"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More <i className="fa fa-external-link"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer-left">
        <span>© 2025 OMoWiCe</span>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-right">
        <a
          href="https://www.omowice.live"
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More <i className="fa fa-external-link"></i>
        </a>

        <div className="footer-divider"></div>

        <span className="refresh-timestamp">{formatLastRefresh()}</span>
      </div>
    </footer>
  );
};

export default Footer;
