export type UserRole = 'citizen' | 'responder' | 'administrator';

export type LanguageCode = 'English' | 'Telugu' | 'Hindi';

export type DisasterType =
  | 'Flood'
  | 'Earthquake'
  | 'Cyclone'
  | 'Tsunami'
  | 'Landslide'
  | 'Forest fire'
  | 'Industrial accident'
  | 'Extreme weather'
  | 'Building collapse'
  | 'Major road accident'
  | 'Other emergency';

export type SeverityLevel = 'Safe' | 'Warning' | 'High Risk' | 'Critical';

export type RescueTeamStatus =
  | 'Available'
  | 'En Route'
  | 'Active'
  | 'Completed'
  | 'Standby'
  | 'Dispatched'
  | 'On-Site'
  | 'In-Transit';

export type EmergencyCategory =
  | 'Medical'
  | 'Fire'
  | 'Flood'
  | 'Accident'
  | 'Building collapse'
  | 'Missing person'
  | 'Trapped person'
  | 'Trapped persons'
  | 'Hazardous Material'
  | 'Other';

export interface DisasterZone {
  id: string;
  name: string;
  disasterType: DisasterType;
  severity: SeverityLevel;
  center: { x: number; y: number; lat: number; lng: number };
  radius: number; // in km or SVG units
  affectedPopulation: number;
  emergencyRequests: number;
  weatherCondition: string;
  waterLevelOrRiskVal: string;
  activeTeamsCount: number;
  nearestHospital: string;
  evacuationRoute?: string;
  aiRiskAssessment: string;
  lastUpdated?: string;
}

export interface MapMarker {
  id: string;
  type:
    | 'rescue_team'
    | 'ambulance'
    | 'fire_truck'
    | 'police'
    | 'hospital'
    | 'shelter'
    | 'supply_center'
    | 'blocked_road'
    | 'citizen_sos';
  name: string;
  position: { x: number; y: number; lat?: number; lng?: number };
  status: string;
  details?: string;
  capacity?: string;
  occupancy?: number;
  contact?: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  type: string;
  location?: string;
  currentLocation?: string;
  coordinates?: { lat: number; lng: number };
  status: RescueTeamStatus;
  assignment?: string;
  assignedZone?: string;
  personnelCount: number;
  vehicles?: string;
  equipment?: string[];
  contactRadio?: string;
  rescuedCount?: number;
  etaMinutes?: number;
  lastCheckIn?: string;
}

export interface Hospital {
  id: string;
  name: string;
  distanceKm?: number;
  address?: string;
  availableBeds: number;
  totalBeds: number;
  icuAvailable?: number;
  icuBedsAvailable?: number;
  totalIcu?: number;
  oxygenStatus?: 'Abundant' | 'Sufficient' | 'Low' | 'Critical';
  emergencyCapacity?: number; // percentage
  ambulancesAvailable?: number;
  ambulancesStationed?: number;
  traumaLevel?: 'Level 1' | 'Level 2' | 'Community';
  status: string;
  contact?: string;
  emergencyPhone?: string;
  bloodSupplyUnits?: Record<string, number>;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  foodSuppliesDays: number;
  waterSuppliesDays: number;
  medicalSupport: boolean;
  powerGenerator: boolean;
  status: 'Open' | 'Nearly Full' | 'Full' | 'Preparing';
  facilities?: string[];
  contactPhone?: string;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  originZone: string;
  destinationShelter: string;
  status: 'Clear & Open' | 'Heavy Congestion' | 'Flooded / Blocked' | 'Emergency Escort Only';
  distanceKm: number;
  estimatedTransitMinutes: number;
  pathCoordinates: string;
  trafficStatus: string;
  hazardNote?: string;
  recommendedVehicle: string;
}

export interface ResourceStock {
  id: string;
  item: string;
  category: string;
  quantity: number;
  unit: string;
  targetThreshold: number;
  status: 'Adequate' | 'Low' | 'Critical';
  burnRateHoursRemaining: number;
  depotLocation: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  category: 'Medical' | 'Food & Water' | 'Shelter Logistics' | 'Vehicles & Craft' | 'Power & Comms';
  quantity: number;
  totalCapacity: number;
  unit: string;
  percentage: number;
  burnRatePerHour: number;
  criticalThreshold: number;
  aiAlert?: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  alertType: 'Warning' | 'Evacuation' | 'Shelter information' | 'Medical emergency' | 'Missing person' | 'All-clear';
  disasterType: DisasterType;
  severity: SeverityLevel;
  zones: string[];
  message: string;
  translations?: Record<LanguageCode, string>;
  channels: string[];
  timestamp: string;
  deliveryStats: {
    smsPercent: number;
    pushPercent: number;
    peopleReached: number;
  };
  status: 'Active' | 'Broadcasting' | 'Scheduled' | 'Resolved';
}

export interface CitizenIncidentReport {
  id: string;
  disasterType?: DisasterType;
  category: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  peopleAffected: number;
  injuredCount?: number;
  immediateDanger?: boolean;
  contactName?: string;
  contactPhone: string;
  photoUrl?: string;
  videoUrl?: string;
  audioNote?: string;
  hasImageAttachment?: boolean;
  aiPriority: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'Urgent' | 'High' | 'Normal';
  status: 'Pending Triage' | 'Assigned' | 'Rescue In Progress' | 'Resolved' | 'Dispatched';
  aiRecommendedAction?: string;
  aiSafetyAdviceForCitizen?: string;
  timestamp: string;
  assignedTeamId?: string;
}

export interface MissingPerson {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  lastSeenLocation: string;
  status: 'Missing' | 'Located in Shelter' | 'Hospitalized' | 'Reunited' | 'Safe' | 'Rescued';
  aiMatchScore?: number;
  matchedShelterLocation?: string;
  reportedBy: string;
  timestamp: string;
  description?: string;
  photoUrl?: string;
}

export interface MissingPersonRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  photoUrl: string;
  lastKnownLocation: string;
  identificationDetails: string;
  registeredBy: string;
  contactPhone: string;
  status: 'Missing' | 'Found' | 'Rescued' | 'Hospitalized' | 'Safe';
  aiMatchFound?: boolean;
  aiMatchConfidence?: number;
  aiMatchDetails?: string;
  reportDate: string;
}

export interface SensorTelemetry {
  id: string;
  name: string;
  type: 'Rain Gauge' | 'River Stage IoT' | 'Seismic Sensor' | 'Satellite Thermal' | 'Social Sentiment' | 'Wind Anemometer';
  location: string;
  value: string;
  numericVal: number;
  unit: string;
  threshold: number;
  status: 'Normal' | 'Elevated' | 'Warning' | 'Critical';
  rateOfChange: string;
  lastPing: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  severity: SeverityLevel | string;
}

export interface ChannelMessage {
  id: string;
  channel: string;
  sender: string;
  role: string;
  avatar: string;
  text: string;
  time: string;
  isPriority?: boolean;
}

export interface CommunicationMessage {
  id: string;
  sender: string;
  channel: string;
  message: string;
  timestamp: string;
  priority: 'Urgent' | 'High' | 'Normal';
}
