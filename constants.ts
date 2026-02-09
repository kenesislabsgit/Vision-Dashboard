
import { Incident, IncidentStatus, KPI, RiskLevel, Site } from './types';

// Curated Unsplash images for specific industrial contexts
const IMAGES = {
  CRANE: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop",
  WELDING: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop",
  EXCAVATION: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop",
  CONVEYOR: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
  REBAR: "https://images.unsplash.com/photo-1617103295952-b8923a48483e?q=80&w=1000&auto=format&fit=crop",
  FORKLIFT: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1000&auto=format&fit=crop",
  SCAFFOLD: "https://images.unsplash.com/photo-1590649803003-2479f64e0d9b?q=80&w=1000&auto=format&fit=crop",
  TANK: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45f7?q=80&w=1000&auto=format&fit=crop"
};

export const MOCK_TIER_1_KPIS: KPI[] = [
  { 
      label: 'Site Safety Score', 
      value: 94, 
      delta: 2.5, 
      trend: 'up',
      threshold: 'Target > 90'
  },
  { 
      label: 'Critical Hazards', 
      value: 2, 
      delta: -1, 
      trend: 'down',
      threshold: 'Target: 0'
  },
  { 
      label: 'Equip. Efficiency', 
      value: '87%', 
      delta: 4.2, 
      trend: 'up',
      threshold: 'Target: 85%' 
  }, 
];

export const MOCK_TIER_2_KPIS: KPI[] = [
  { label: 'Active Projects', value: 8, delta: 0, trend: 'neutral' },
  { label: 'Worker Count', value: '4,210', delta: 5.4, trend: 'up' },
  { label: 'Violations (24h)', value: 12, delta: -3, trend: 'down' },
];

export const MOCK_KPIS: KPI[] = [
  ...MOCK_TIER_1_KPIS,
  ...MOCK_TIER_2_KPIS
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-CNST-901',
    title: 'Crane Load Imbalance',
    timestamp: Date.now() - 1000 * 60 * 2,
    siteId: 'SKYLINE-TOWER',
    zoneId: 'ZN-CRANE-01',
    cameraId: 'CAM-CR-01',
    severity: RiskLevel.CRITICAL,
    confidence: 0.96,
    status: IncidentStatus.ACTIVE,
    type: 'Safety',
    description: 'Tower Crane 1 detected lifting load with unstable center of gravity. Swing radius risk.',
    actionRequired: 'Halt crane operations immediately.',
    rootCauseHypothesis: 'Improper rigging of steel beams.',
    recommendedAction: 'Radio operator to ground load.',
    similarEventsCount: 0,
    sopLink: 'SOP-LIFT-004',
    imageUrl: IMAGES.CRANE,
  },
  {
    id: 'INC-MFG-894',
    title: 'Welding PPE Violation',
    timestamp: Date.now() - 1000 * 60 * 12,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-WELD-BAY',
    cameraId: 'CAM-WB-04',
    severity: RiskLevel.HIGH,
    confidence: 0.99,
    status: IncidentStatus.ACTIVE,
    type: 'Safety',
    description: 'Worker in Bay 4 initiated arc welding without UV face shield deployment.',
    actionRequired: 'Alert Floor Supervisor.',
    rootCauseHypothesis: 'Worker negligence / Fatigue.',
    recommendedAction: 'Trigger auditory strobe alert in bay.',
    similarEventsCount: 3,
    sopLink: 'SOP-PPE-WELD',
    imageUrl: IMAGES.WELDING,
  },
  {
    id: 'INC-CNST-880',
    title: 'Excavation Zone Intrusion',
    timestamp: Date.now() - 1000 * 60 * 45,
    siteId: 'METRO-HUB',
    zoneId: 'ZN-PIT-B',
    cameraId: 'CAM-PT-09',
    severity: RiskLevel.CRITICAL,
    confidence: 0.92,
    status: IncidentStatus.ACKNOWLEDGED,
    type: 'Safety',
    description: 'Unidentified personnel detected inside trench shoring exclusion zone.',
    actionRequired: 'Evacuate trench immediately.',
    rootCauseHypothesis: 'Surveyor taking shortcut.',
    recommendedAction: 'Dispatch safety officer.',
    assignedTo: 'M. Vance',
    imageUrl: IMAGES.EXCAVATION,
  },
  {
    id: 'INC-MFG-865',
    title: 'Conveyor Jam Detected',
    timestamp: Date.now() - 1000 * 60 * 55,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-ASSEMBLY',
    cameraId: 'CAM-LN-02',
    severity: RiskLevel.MEDIUM,
    confidence: 0.88,
    status: IncidentStatus.ACTIVE,
    type: 'Process',
    description: 'Product pile-up detected at Junction 4. Belt motor strain increasing.',
    actionRequired: 'Pause line 2.',
    rootCauseHypothesis: 'Sensor misalignement downstream.',
    recommendedAction: 'Pause line and clear obstruction.',
    similarEventsCount: 5,
    sopLink: 'SOP-LN-JAM',
    imageUrl: IMAGES.CONVEYOR,
  },
  {
    id: 'INC-CNST-850',
    title: 'Rebar Spacing Deviation',
    timestamp: Date.now() - 1000 * 60 * 90,
    siteId: 'SKYLINE-TOWER',
    zoneId: 'ZN-FLOOR-14',
    cameraId: 'CAM-DRONE-04',
    severity: RiskLevel.MEDIUM,
    confidence: 0.85,
    status: IncidentStatus.RESOLVED,
    type: 'Quality',
    description: 'Drone scan indicates rebar grid spacing exceeds tolerance (>15cm) in sector 4.',
    actionRequired: 'Verify measurement.',
    rootCauseHypothesis: 'Manual tying error.',
    recommendedAction: 'Flag for rework before pour.',
    assignedTo: 'QC Team',
    imageUrl: IMAGES.REBAR,
  },
  {
    id: 'INC-MFG-840',
    title: 'Automated Vehicle Path Block',
    timestamp: Date.now() - 1000 * 60 * 120,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-LOGISTICS',
    cameraId: 'CAM-AGV-01',
    severity: RiskLevel.LOW,
    confidence: 0.94,
    status: IncidentStatus.RESOLVED,
    type: 'Process',
    description: 'Pallet left in AGV Route B. Vehicle stopped.',
    actionRequired: 'Clear route.',
    rootCauseHypothesis: 'Forklift driver error.',
    recommendedAction: 'Reroute AGV.',
    assignedTo: 'Auto-Resolved',
    imageUrl: IMAGES.FORKLIFT,
  },
  {
    id: 'INC-CNST-810',
    title: 'Scaffold Anchor Stress',
    timestamp: Date.now() - 1000 * 60 * 180,
    siteId: 'SKYLINE-TOWER',
    zoneId: 'ZN-EXT-WEST',
    cameraId: 'CAM-SENS-03',
    severity: RiskLevel.HIGH,
    confidence: 0.78,
    status: IncidentStatus.ACKNOWLEDGED,
    type: 'Safety',
    description: 'Visual deflection detected in Scaffold Tier 4 Anchor Point.',
    actionRequired: 'Inspect structural integrity.',
    rootCauseHypothesis: 'High wind load.',
    recommendedAction: 'Clear platform and reinforce.',
    assignedTo: 'Structural Eng.',
    imageUrl: IMAGES.SCAFFOLD,
  },
  {
    id: 'INC-MFG-790',
    title: 'Chemical Tank Leak',
    timestamp: Date.now() - 1000 * 60 * 300,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-COATING',
    cameraId: 'CAM-TH-02',
    severity: RiskLevel.CRITICAL,
    confidence: 0.99,
    status: IncidentStatus.RESOLVED,
    type: 'Safety',
    description: 'Thermal camera detected fluid leak from Tank 4 (Hot Dip Galvanizing).',
    actionRequired: 'Hazmat containment.',
    rootCauseHypothesis: 'Valve seal failure.',
    recommendedAction: 'Initiate emergency drain.',
    assignedTo: 'Safety Ops',
    imageUrl: IMAGES.TANK,
  }
];

export const MOCK_SITES: Site[] = [
  {
    id: 'SKYLINE-TOWER',
    name: 'Skyline Tower Project',
    location: 'New York, NY',
    riskIndex: 18,
    activeAlerts: 2,
    zones: [
      { id: 'ZN-CRANE-01', siteId: 'SKYLINE-TOWER', name: 'Crane Operations', riskScore: 65, cameras: [] },
      { id: 'ZN-FLOOR-14', siteId: 'SKYLINE-TOWER', name: 'Level 14 Deck', riskScore: 12, cameras: [] },
      { id: 'ZN-PIT-A', siteId: 'SKYLINE-TOWER', name: 'Foundation Pit', riskScore: 5, cameras: [] },
    ]
  },
  {
    id: 'APEX-STEEL',
    name: 'Apex Steelworks',
    location: 'Pittsburgh, PA',
    riskIndex: 42,
    activeAlerts: 3,
    zones: [
      { id: 'ZN-WELD-BAY', siteId: 'APEX-STEEL', name: 'Welding Bay', riskScore: 55, cameras: [] },
      { id: 'ZN-COATING', siteId: 'APEX-STEEL', name: 'Coating Line', riskScore: 25, cameras: [] },
    ]
  },
  {
    id: 'METRO-HUB',
    name: 'Metro Transit Hub',
    location: 'Chicago, IL',
    riskIndex: 8,
    activeAlerts: 1,
    zones: [
      { id: 'ZN-TUNNEL', siteId: 'METRO-HUB', name: 'Tunnel Boring', riskScore: 8, cameras: [] },
    ]
  }
];
