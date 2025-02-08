import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <AppBar position="static" sx={{ bgcolor: 'grey.800' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
        <div>
          <Button color="inherit" onClick={handleOpen}>Disclaimer</Button>
          <Button color="inherit" href="https://documentation.link" target="_blank">Docs</Button>
        </div>
      </Toolbar>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ethical Concerns</DialogTitle>
        <DialogContent>
          Our research adheres to strict ethical guidelines to ensure privacy and security of all data collected.
          Transparency, consent, and responsible data use are our top priorities.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}