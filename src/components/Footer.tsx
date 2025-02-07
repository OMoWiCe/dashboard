import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: 'grey.800', color: 'white', p: 2, textAlign: 'center', mt: 4 }}>
      <Typography>&copy; 2025 Your Company. <Link href="https://documentation.link" target="_blank" color="inherit">Documentation</Link></Typography>
    </Box>
  );
}