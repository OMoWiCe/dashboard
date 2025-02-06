import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LocationCard = () => {
  const liveCount = 175;
  const waitingTime = 15;

  return (
    <Card className="location-card">
      <CardContent>
        <h2 className="location-title">Location Name</h2>
        <p className="location-info">Location City | Open: 9am - 6pm</p>
        <div className="location-stats">
          <p className="live-count">Live: {liveCount > 0 ? liveCount : '-'}</p>
          <p className="waiting-time">Waiting Time: {waitingTime > 0 ? `≈ ${waitingTime} mins` : '-'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;