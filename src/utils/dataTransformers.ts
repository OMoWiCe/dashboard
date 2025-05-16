import type { Location, Metrics, DetailedMetrics, LocationWithMetrics } from '../types/api';

/**
 * Transforms API location and metrics data into the format used by the dashboard
 */
export const transformLocationData = (
  location: Location,
  metrics?: Metrics | DetailedMetrics
): LocationWithMetrics => {
  // Default values if metrics are not available
  const defaultMetrics = {
    liveOccupancy: 0,
    liveOccupancyChange: 0,
    turnoverTime: 0,
    turnoverTimeChange: 0,
    lastUpdated: new Date().toISOString(),
    updateInterval: 60,
    todayAvgHourlyOccupancy: Array(24).fill(0),
  };

  // Use provided metrics or defaults
  const data = metrics || defaultMetrics;
  
  // Determine trend direction based on occupancy change
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (data.liveOccupancyChange > 0) trend = 'up';
  else if (data.liveOccupancyChange < 0) trend = 'down';
  else if (data.liveOccupancyChange === 0) trend = 'stable';
    
  // Determine waiting time trend direction based on turnover time change
  let waitingTimeTrend: 'up' | 'down' | 'stable' = 'stable';
  if (data.turnoverTimeChange > 0) waitingTimeTrend = 'up';
  else if (data.turnoverTimeChange < 0) waitingTimeTrend = 'down';
  else if (data.turnoverTimeChange === 0) waitingTimeTrend = 'stable';
    
  // Convert turnover time from seconds to minutes and format as a string
  const turnoverTimeInMinutes = Math.round(data.turnoverTime / 60);
  // add (s) end (min) to the string if the turnover time is greater than 1 minute, or if it is 0 then output "-"
  const turnoverTime = turnoverTimeInMinutes > 1 ? `${turnoverTimeInMinutes} mins` : (turnoverTimeInMinutes === 0 ? '-' : `${turnoverTimeInMinutes} min`);
  const waitingTime = turnoverTime;
  
  // For hourly trend, use detailed metrics if available, otherwise use default
  const hourlyTrend = 'todayAvgHourlyOccupancy' in data 
    ? data.todayAvgHourlyOccupancy
    : Array(24).fill(0); // Empty 24-hour array if no detailed data

  // Convert now time to +5:30 GMT (India Standard Time) to match the lastUpdated time
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  // Converting lastUpdated to -5:30 GMT (India Standard Time) to match the now time
  const lastUpdatedDate = new Date(data.lastUpdated);
  lastUpdatedDate.setHours(lastUpdatedDate.getHours() - 5);
  lastUpdatedDate.setMinutes(lastUpdatedDate.getMinutes() - 30);
    // Decide if the location is live if metrics lastupdate is not older than 5 times of the update interval
  const isLive = (now.getTime() - lastUpdatedDate.getTime()) < (data.updateInterval * 5 * 60 * 1000);

  return {
    id: location.locationId,
    name: location.name,
    address: location.address,
    googleMapsUrl: location.googleMapsUrl,
    openHours: location.openingHours,
    currentOccupancy: data.liveOccupancy,
    trend,
    waitingTime,
    waitingTimeTrend,
    isLive: isLive,
    hourlyTrend,
    lastUpdated: lastUpdatedDate,
    updateInterval: data.updateInterval,
  };
};

/**
 * Combines locations with their metrics
 */
export const combineLocationsWithMetrics = (
  locations: Location[],
  metricsArray: Metrics[]
): LocationWithMetrics[] => {
  return locations.map(location => {
    // Find matching metrics for this location
    const metrics = metricsArray.find(m => m.locationId === location.locationId);
    return transformLocationData(location, metrics);
  });
};