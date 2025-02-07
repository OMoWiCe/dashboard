import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function Header() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard Logo
        </Typography>
        <Button color="inherit" onClick={handleOpen}>Disclaimer</Button>
        <Button color="inherit" href="https://documentation.link" target="_blank">Docs</Button>
      </Toolbar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ethical Concerns</DialogTitle>
        <DialogContent>
          <Typography>
            Our research adheres to strict ethical guidelines to ensure privacy and security of data. Transparency, consent, and responsible use are our top priorities.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default Header;