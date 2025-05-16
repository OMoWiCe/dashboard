// TypeScript interfaces for API responses based on documentation

// Location interfaces
export interface Location {
  locationId: string;
  name: string;
  address: string;
  googleMapsUrl: string;
  openingHours: string;
}

// Metrics interfaces
export interface Metrics {
  locationId: string;
  liveOccupancy: number;
  liveOccupancyChange: number;
  turnoverTime: number;
  turnoverTimeChange: number;
  lastUpdated: string;
  updateInterval: number;
}

// Detailed metrics including hourly data
export interface DetailedMetrics extends Metrics {
  todayAvgHourlyOccupancy: number[];
}

// Combined data interface for the dashboard
export interface LocationWithMetrics {
  id: string;
  name: string;
  address: string;
  googleMapsUrl: string;
  openHours: string;
  currentOccupancy: number;
  trend: 'up' | 'down' | 'stable';
  waitingTime: string;
  waitingTimeTrend: 'up' | 'down' | 'stable';
  isLive: boolean;
  hourlyTrend: number[];
  lastUpdated: Date;
  updateInterval: number; // Added updateInterval in minutes
}