export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum IncidentStatus {
  ACTIVE = 'Active',
  ACKNOWLEDGED = 'Acknowledged',
  ESCALATED = 'Escalated',
  RESOLVED = 'Resolved',
}

export interface Camera {
  id: string;
  name: string;
  zoneId: string;
  status: 'online' | 'offline' | 'maintenance';
  lastPing: number;
  thumbnailUrl: string;
}

export interface Zone {
  id: string;
  siteId: string;
  name: string;
  riskScore: number;
  cameras: Camera[];
}

export interface Site {
  id: string;
  name: string;
  location: string;
  zones: Zone[];
  activeAlerts: number;
  riskIndex: number; // 0-100
}

export interface Incident {
  id: string;
  title: string;
  timestamp: number;
  siteId: string;
  zoneId: string;
  cameraId: string;
  severity: RiskLevel;
  confidence: number; // 0-1
  status: IncidentStatus;
  type: 'Safety' | 'Process' | 'Security' | 'Equipment' | 'Quality';
  description: string;
  actionRequired: string;
  assignedTo?: string;
  imageUrl?: string;
  
  // Decision Support
  rootCauseHypothesis?: string;
  recommendedAction?: string;
  similarEventsCount?: number;
  sopLink?: string;
}

export interface KPI {
  label: string;
  value: string | number;
  delta: number; // Percentage change
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
  threshold?: string; // e.g. "Target: <5m"
}