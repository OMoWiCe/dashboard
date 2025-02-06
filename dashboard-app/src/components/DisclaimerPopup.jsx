import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DisclaimerPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenDisclaimer = () => setIsOpen(true);
    window.addEventListener('openDisclaimer', handleOpenDisclaimer);
    return () => window.removeEventListener('openDisclaimer', handleOpenDisclaimer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="popup-content">
        <DialogTitle className="popup-title">Disclaimer</DialogTitle>
        <p className="popup-text">Ethical Consent details go here...</p>
        <Button onClick={() => setIsOpen(false)} className="popup-button">OK</Button>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerPopup;