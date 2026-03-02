
import { Incident, IncidentStatus, KPI, RiskLevel, Site } from './types';

// Real surveillance videos from industrial facility
const VIDEOS = {
  CNC_LATHE: "/videos/CNC Vertical Turning Lathe.mp4",
  LONG_VIEW: "/videos/long view cam 4.mp4",
  MACHINE: "/videos/machine.mp4",
  PARTS_ASSEMBLY: "/videos/parts assembling cam.mp4",
  SHEET_ARRANGING: "/videos/sheet arranging.mp4",
  STORE_ROOM: "/videos/store_room_cam.mp4",
  TOP_VIEW: "/videos/top view cam.mp4"
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
    id: 'INC-MFG-901',
    title: 'CNC Vertical Turning Lathe - Precision Monitoring',
    timestamp: Date.now() - 1000 * 60 * 2,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-MACHINING',
    cameraId: 'CAM-CNC-01',
    severity: RiskLevel.MEDIUM,
    confidence: 0.96,
    status: IncidentStatus.ACTIVE,
    type: 'Quality',
    description: 'CNC vertical turning lathe showing irregular vibration patterns during heavy metal turning operation. Tool wear monitoring system detected potential dimensional deviation.',
    actionRequired: 'Inspect tool condition and workpiece alignment.',
    rootCauseHypothesis: 'Excessive tool wear or improper clamping pressure.',
    recommendedAction: 'Pause operation for tool inspection.',
    similarEventsCount: 0,
    sopLink: 'SOP-CNC-004',
    imageUrl: VIDEOS.CNC_LATHE,
  },
  {
    id: 'INC-MFG-894',
    title: 'Long View Camera 4 - Floor Monitoring',
    timestamp: Date.now() - 1000 * 60 * 12,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-ASSEMBLY',
    cameraId: 'CAM-LV-04',
    severity: RiskLevel.LOW,
    confidence: 0.92,
    status: IncidentStatus.ACTIVE,
    type: 'Process',
    description: 'Wide-angle floor surveillance camera capturing overall production floor activity. System monitoring workflow efficiency and worker movement patterns across assembly lines.',
    actionRequired: 'Continue monitoring for anomalies.',
    rootCauseHypothesis: 'Routine surveillance operation.',
    recommendedAction: 'Maintain real-time monitoring coverage.',
    similarEventsCount: 0,
    sopLink: 'SOP-SURV-001',
    imageUrl: VIDEOS.LONG_VIEW,
  },
  {
    id: 'INC-MFG-880',
    title: 'Machine Operation - Safety Compliance Check',
    timestamp: Date.now() - 1000 * 60 * 45,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-MACHINING',
    cameraId: 'CAM-MC-09',
    severity: RiskLevel.HIGH,
    confidence: 0.92,
    status: IncidentStatus.ACKNOWLEDGED,
    type: 'Safety',
    description: 'Heavy machinery operation detected without proper safety guard engagement. Worker proximity to moving parts requires immediate verification.',
    actionRequired: 'Verify safety protocol compliance.',
    rootCauseHypothesis: 'Potential safety guard bypass or maintenance mode.',
    recommendedAction: 'Dispatch floor supervisor for inspection.',
    assignedTo: 'M. Vance',
    imageUrl: VIDEOS.MACHINE,
  },
  {
    id: 'INC-MFG-865',
    title: 'Parts Assembly Camera - Workflow Analysis',
    timestamp: Date.now() - 1000 * 60 * 55,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-ASSEMBLY',
    cameraId: 'CAM-PA-02',
    severity: RiskLevel.MEDIUM,
    confidence: 0.88,
    status: IncidentStatus.ACTIVE,
    type: 'Process',
    description: 'Parts assembly station monitoring detected irregular component positioning. Manual assembly process showing slight deviation from standard procedure timing.',
    actionRequired: 'Review assembly procedure adherence.',
    rootCauseHypothesis: 'Worker training gap or component variation.',
    recommendedAction: 'Quality control spot check required.',
    similarEventsCount: 2,
    sopLink: 'SOP-ASM-002',
    imageUrl: VIDEOS.PARTS_ASSEMBLY,
  },
  {
    id: 'INC-MFG-850',
    title: 'Sheet Arranging - Material Handling',
    timestamp: Date.now() - 1000 * 60 * 90,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-LOGISTICS',
    cameraId: 'CAM-SA-04',
    severity: RiskLevel.MEDIUM,
    confidence: 0.85,
    status: IncidentStatus.RESOLVED,
    type: 'Quality',
    description: 'Sheet metal arranging station shows non-standard stacking pattern. Material handling procedure deviation detected during inventory organization.',
    actionRequired: 'Verify material organization standards.',
    rootCauseHypothesis: 'Operator improvisation or space optimization attempt.',
    recommendedAction: 'Retrain on proper stacking procedures.',
    assignedTo: 'QC Team',
    imageUrl: VIDEOS.SHEET_ARRANGING,
  },
  {
    id: 'INC-MFG-840',
    title: 'Store Room Camera - Inventory Monitoring',
    timestamp: Date.now() - 1000 * 60 * 120,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-STORAGE',
    cameraId: 'CAM-SR-01',
    severity: RiskLevel.LOW,
    confidence: 0.94,
    status: IncidentStatus.RESOLVED,
    type: 'Security',
    description: 'Store room surveillance detected after-hours access. Authorized personnel verified retrieving emergency spare parts for production line maintenance.',
    actionRequired: 'Verify access authorization.',
    rootCauseHypothesis: 'Scheduled maintenance activity.',
    recommendedAction: 'Log access in maintenance records.',
    assignedTo: 'Auto-Resolved',
    imageUrl: VIDEOS.STORE_ROOM,
  },
  {
    id: 'INC-MFG-810',
    title: 'Top View Camera - Overhead Production Monitoring',
    timestamp: Date.now() - 1000 * 60 * 180,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-ASSEMBLY',
    cameraId: 'CAM-TV-03',
    severity: RiskLevel.LOW,
    confidence: 0.88,
    status: IncidentStatus.ACKNOWLEDGED,
    type: 'Process',
    description: 'Overhead camera monitoring production flow and workstation layout efficiency. AI analyzing worker movement patterns and identifying potential bottlenecks in assembly process.',
    actionRequired: 'Continue workflow optimization analysis.',
    rootCauseHypothesis: 'Standard operational monitoring.',
    recommendedAction: 'Generate efficiency report for management.',
    assignedTo: 'Process Eng.',
    imageUrl: VIDEOS.TOP_VIEW,
  },
  {
    id: 'INC-MFG-790',
    title: 'Machine Operation - Automated Processing Complete',
    timestamp: Date.now() - 1000 * 60 * 300,
    siteId: 'APEX-STEEL',
    zoneId: 'ZN-MACHINING',
    cameraId: 'CAM-MC-02',
    severity: RiskLevel.LOW,
    confidence: 0.99,
    status: IncidentStatus.RESOLVED,
    type: 'Process',
    description: 'Automated machining operation completed successfully. Computer vision confirmed proper part ejection and quality parameters met specifications.',
    actionRequired: 'No action required - successful completion.',
    rootCauseHypothesis: 'Standard operational cycle.',
    recommendedAction: 'Log production metrics and continue.',
    assignedTo: 'Auto-Logged',
    imageUrl: VIDEOS.MACHINE,
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
