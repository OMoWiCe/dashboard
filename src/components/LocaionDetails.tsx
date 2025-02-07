import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function LocationDetails() {
  const location = 'Sample Location';
  const openHours = '9am - 6pm';

  return (
    <Card sx={{ backgroundColor: '#1d1d1d', m: 2 }}>
      <CardContent>
        <Typography variant="h5">{location}</Typography>
        <Typography variant="body2">Open: {openHours}</Typography>
        <Button 
          startIcon={<LocationOnIcon />} 
          onClick={() => window.open(`https://maps.google.com/?q=${location}`, '_blank')} 
          sx={{ mt: 1 }}
        >
          View on Map
        </Button>
        <Typography variant="h6" sx={{ mt: 2 }}>Live Occupancy: 175+</Typography>
        <Typography variant="h6">Waiting Time: ~15 mins</Typography>
      </CardContent>
    </Card>
  );
}

export default LocationDetails;