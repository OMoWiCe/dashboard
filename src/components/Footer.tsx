import "../css/Footer.css";

interface FooterProps {
  lastRefreshTime: Date | null;
}

const Footer = ({ lastRefreshTime }: FooterProps) => {
  // Format the last refresh time
  const formatLastRefresh = () => {
    if (!lastRefreshTime) return "Not refreshed yet";
    return `Last refreshed: ${lastRefreshTime.toLocaleTimeString()}`;
  };

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
