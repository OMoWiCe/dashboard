import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box textAlign="center" p={2} bgcolor="#1d1d1d">
      <Typography variant="body2">
        &copy; 2025 Your Company. <Link href="https://documentation.link" target="_blank" color="primary">Documentation</Link>
      </Typography>
    </Box>
  );
}
