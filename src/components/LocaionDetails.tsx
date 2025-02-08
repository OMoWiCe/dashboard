import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Room } from '@mui/icons-material';

interface LocationDetailsProps {
  location: string;
}

export default function LocationDetails({ location }: LocationDetailsProps) {
  return (
    <Card sx={{ bgcolor: 'grey.800', color: 'white', mb: 4, border: '1px solid white' }}>
      <CardContent>
        <Typography variant="h5" component="div">{location}</Typography>
        <Typography sx={{ mb: 1.5 }} color="gray">Open: 9am - 6pm</Typography>
        <Button variant="outlined" startIcon={<Room />} onClick={() => window.open(`https://maps.google.com/?q=${location}`, '_blank')}>
          View on Map
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Typography variant="body1">Live Occupancy: <strong>175+</strong></Typography>
          <Typography variant="body1">Waiting Time: <strong>~15 mins</strong></Typography>
        </Box>
      </CardContent>
    </Card>
  );
}