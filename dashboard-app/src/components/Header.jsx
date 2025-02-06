import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <div className="header">
      <h1 className="title">Dashboard</h1>
      <div className="header-links">
        <Button variant="link" onClick={() => window.dispatchEvent(new Event('openDisclaimer'))}>Disclaimer</Button>
        <Button variant="link">Docs</Button>
      </div>
    </div>
  );
};

export default Header;