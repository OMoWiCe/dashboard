// TypeScript interfaces for Admin Panel functionality

import type { Location } from './api';

// Extended location interface for admin panel with status and last active
export interface LocationWithStatus extends Location {
  status: 'online' | 'offline';
  lastActive: Date;
  updateInterval: number; // in minutes
}

// Interface for location parameters used in the modal
export interface LocationParameters {
  avgDevicesPerPerson: number;
  avgSimsPerPerson: number;
  wifiUsageRatio: number;
  cellularUsageRatio: number;
  updateInterval: number;
}

// Interface for creating/updating a location
export interface LocationCreateRequest {
  id: string;
  name: string;
  address: string;
  googleMapsUrl: string;
  openingHours: string;
  parameters: LocationParameters;
}

// Interface for updating a location
export interface LocationUpdateRequest {
  name: string;
  address: string;
  googleMapsUrl: string;
  openingHours: string;
  parameters: LocationParameters;
}