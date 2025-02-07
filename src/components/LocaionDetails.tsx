import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function LocationDetails() {
  const location = 'Sample Location';

  return (
    <Card className="bg-gray-800">
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{location}</h2>
            <p>Open: 9am - 6pm</p>
          </div>
          <Button onClick={() => window.open(`https://maps.google.com/?q=${location}`, '_blank')}><MapPin /></Button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-lg">Live Occupancy</p>
            <p className="text-3xl font-bold">175+</p>
          </div>
          <div>
            <p className="text-lg">Waiting Time</p>
            <p className="text-3xl font-bold">~15 mins</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
