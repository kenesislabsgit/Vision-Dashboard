
import React, { useState, useMemo } from 'react';
import { MOCK_INCIDENTS, MOCK_TIER_1_KPIS } from '../constants';
import { Incident, KPI, RiskLevel, IncidentStatus } from '../types';
import { 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    ArrowRight, 
    MapPin, 
    ShieldAlert, 
    CornerUpRight,
    Activity,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Maximize2,
    Share2,
    MoreHorizontal,
    Siren,
    Layers,
    Cpu,
    Scan,
    Minus
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const generateSparklineData = (trend: 'up' | 'down' | 'neutral', label: string) => {
    const seed = label.length;
    const points = 20;
    return Array.from({ length: points }, (_, i) => {
        const wave = Math.sin((i + seed) * 0.5) * 10;
        let trendFactor = 0;
        if (trend === 'up') trendFactor = i * 2.5;
        if (trend === 'down') trendFactor = i * -2.5;
        const noise = (Math.random() - 0.5) * 8;
        const value = Math.max(10, 50 + trendFactor + wave + noise);
        return { value };
    });
};

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
    const isNegativeMetric = ['Risk', 'Hazard', 'Violation', 'Incident', 'Downtime'].some(term => kpi.label.includes(term));
    const isTrendGood = isNegativeMetric ? kpi.trend === 'down' : kpi.trend === 'up';
    const isCritical = kpi.label.includes('Critical') && (typeof kpi.value === 'number' ? kpi.value > 0 : parseInt(kpi.value.toString()) > 0);

    let chartColor = '#6B7280';
    if (isCritical) chartColor = '#EF4444';
    else if (isTrendGood) chartColor = '#10B981';
    else if (kpi.trend !== 'neutral') chartColor = '#F59E0B';

    const sparkData = useMemo(() => generateSparklineData(kpi.trend, kpi.label), [kpi.trend, kpi.label]);

    return (
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 group h-44 flex flex-col justify-between p-6">
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{kpi.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold tracking-tight text-charcoal">{kpi.value}</h3>
                            {kpi.unit && <span className="text-sm font-medium text-gray-400">{kpi.unit}</span>}
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        isTrendGood ? 'bg-green-50 text-emerald-600 border-green-100'
                        : kpi.trend === 'neutral' ? 'bg-gray-50 text-gray-600 border-gray-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        {kpi.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
                        {kpi.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
                        {kpi.trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
                        {Math.abs(kpi.delta)}%
                    </div>
                </div>
                <div className="text-xs font-medium text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-100 self-start shadow-sm mt-auto">
                    {kpi.threshold || 'Monitoring'}
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-24 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`grad-${kpi.label}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={chartColor} stopOpacity={0.6}/>
                                <stop offset="100%" stopColor={chartColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={3} fill={`url(#grad-${kpi.label})`} isAnimationActive={true} animationDuration={1500} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const QueueItem: React.FC<{ incident: Incident; isSelected: boolean; onSelect: () => void }> = ({ incident, isSelected, onSelect }) => {
    const timeSince = (timestamp: number) => {
        const diff = Math.floor((Date.now() - timestamp) / 60000);
        if (diff < 1) return 'Now';
        if (diff < 60) return `${diff}m`;
        return `${Math.floor(diff/60)}h`;
    };
    const isActionRequired = incident.status === IncidentStatus.ACTIVE && (incident.severity === RiskLevel.CRITICAL || incident.severity === RiskLevel.HIGH);

    return (
        <button
            onClick={onSelect}
            className={`w-full text-left group relative flex items-start gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 transition-all duration-200 ${isSelected ? 'bg-gray-50 border-l-4 border-l-charcoal pl-[13px]' : 'border-l-4 border-l-transparent'}`}
        >
            <div className="flex-shrink-0 pt-1">
                {isActionRequired ? (
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm text-status-error">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                        </span>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-500">
                        {incident.status === IncidentStatus.RESOLVED ? <CheckCircle2 className="w-5 h-5 text-status-success" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                    <span className={`text-sm font-bold truncate ${isActionRequired ? 'text-charcoal' : 'text-gray-600'}`}>{incident.title}</span>
                    <span className="text-xs font-mono font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-sm">{timeSince(incident.timestamp)}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 mb-2">{incident.description}</p>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-1.5 py-0.5 rounded">{incident.siteId}</span>
                    {isActionRequired && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase">Action Req</span>}
                </div>
            </div>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
                <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
        </button>
    );
};

const DigitalTwinView: React.FC<{ incident: Incident }> = ({ incident }) => {
    return (
        <div className="relative aspect-video bg-charcoal rounded-xl overflow-hidden shadow-card-dark group border border-gray-800 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#6B7280 1px, transparent 1px), linear-gradient(90deg, #6B7280 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="relative w-full h-full p-12">
                <svg viewBox="0 0 800 450" className="w-full h-full text-gray-600 stroke-current stroke-[2] fill-none drop-shadow-2xl">
                    <path d="M100 400 L700 400 L600 300 L200 300 Z" className="opacity-20 fill-gray-700 stroke-none" />
                    <path d="M100 400 L700 400 M600 300 L200 300 M100 400 L200 300 M700 400 L600 300" strokeDasharray="5 5" />
                    <path d="M300 350 L300 150 L500 150 L500 350" className="stroke-gray-500" />
                    <circle cx="400" cy="150" r="40" className="stroke-gray-400" />
                    <path d="M400 150 L650 100" className="stroke-primary/50" strokeDasharray="5 5" />
                    <circle cx="300" cy="250" r="4" className="fill-gray-400" />
                    <circle cx="500" cy="250" r="4" className="fill-gray-400" />
                    <circle cx="400" cy="150" r="6" className="fill-status-error animate-ping" />
                    <circle cx="400" cy="150" r="6" className="fill-status-error stroke-white stroke-2" />
                </svg>
                <div className="absolute top-1/4 left-1/2 translate-x-4 flex flex-col gap-2">
                    <div className="bg-charcoal/90 backdrop-blur border border-red-500/50 p-3 rounded-lg shadow-2xl min-w-[160px]">
                        <div className="flex items-center gap-2 mb-1">
                            <Siren className="w-3 h-3 text-status-error" />
                            <span className="text-[10px] font-bold text-red-400 uppercase">Anomaly Detected</span>
                        </div>
                        <div className="text-xl font-mono font-bold text-white">94.2<span className="text-xs text-gray-400 ml-1">%</span></div>
                        <div className="text-[10px] text-gray-400 uppercase">Load Capacity Limit</div>
                    </div>
                </div>
                <div className="absolute bottom-8 left-8 flex gap-4">
                    <div className="bg-gray-800/80 backdrop-blur p-2 rounded border border-gray-700 text-xs font-mono text-gray-300">
                        <div className="text-[9px] text-gray-500 uppercase">Sensor A4</div>
                        <div>TEMP: 42°C</div>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur p-2 rounded border border-gray-700 text-xs font-mono text-gray-300">
                        <div className="text-[9px] text-gray-500 uppercase">Sensor B2</div>
                        <div>VIB: 0.02g</div>
                    </div>
                </div>
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-white tracking-wide">DIGITAL TWIN • LIVE</span>
                </div>
                <div className="flex gap-1">
                    <button className="p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-700 transition-colors"><Layers className="w-3 h-3" /></button>
                    <button className="p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-700 transition-colors"><Scan className="w-3 h-3" /></button>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <div className="h-full bg-primary w-full animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
            </div>
        </div>
    );
};

const MissionControl: React.FC<{ incident: Incident | null }> = ({ incident }) => {
    if (!incident) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200/60 m-4 shadow-inner min-h-[400px]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-card mb-6">
                    <Activity className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-charcoal">System Monitoring Active</h2>
                <p className="text-gray-500 max-w-md text-center mt-2 px-4">Select an event from the decision queue to activate the incident command workspace.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start gap-4 flex-shrink-0 bg-white z-20">
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="px-2.5 py-1 bg-charcoal text-white text-xs font-mono rounded">ID: {incident.id.split('-').pop()}</div>
                        {incident.severity === RiskLevel.CRITICAL && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-status-error text-xs font-bold uppercase rounded border border-red-100 animate-pulse">
                                <Siren className="w-3 h-3" /> Critical Priority
                            </div>
                        )}
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {incident.siteId} / {incident.zoneId}
                        </span>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-bold text-charcoal tracking-tight leading-tight">{incident.title}</h1>
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-charcoal text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <Share2 className="w-4 h-4" /> <span className="lg:hidden">Share</span>
                    </button>
                    <button className="flex-none flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-charcoal text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-6 py-2 bg-charcoal text-white text-sm font-bold rounded-lg hover:bg-black transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                        Resolve Incident
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-2">
                        <DigitalTwinView incident={incident} />
                        <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                            <span>Telemetry sync: {new Date(incident.timestamp).toLocaleTimeString()} • 32ms Latency</span>
                            <button className="flex items-center gap-1 hover:text-charcoal transition-colors"><Maximize2 className="w-3 h-3" /> Fullscreen Analysis</button>
                        </div>
                    </div>
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Cpu className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wide">Kenesis AI Analysis</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                        <span>Confidence Score</span>
                                        <span className="text-charcoal">{(incident.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div className="bg-charcoal h-full rounded-full transition-all duration-1000" style={{ width: `${incident.confidence * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Root Cause Hypothesis</p>
                                    <p className="text-sm font-medium text-charcoal leading-snug">{incident.rootCauseHypothesis || 'Analyzing sensor fusion patterns...'}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Trigger Logic</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Sensor Fusion', 'Predictive Model', 'Threshold Breach'].map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 shadow-sm flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <CornerUpRight className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wide">Recommendation</h3>
                            </div>
                            <p className="text-sm font-medium text-charcoal leading-relaxed">{incident.recommendedAction}</p>
                            <div className="mt-4 pt-4 border-t border-orange-200/50">
                                <span className="text-xs font-bold text-orange-800 uppercase">Relevant SOP</span>
                                <button className="flex items-center gap-2 mt-2 text-xs font-bold text-charcoal hover:text-primary transition-colors bg-white/50 px-3 py-2 rounded-lg w-full border border-orange-200/50 hover:border-orange-300">
                                    <FileText className="w-3 h-3" /> {incident.sopLink || 'SOP-GEN-001'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                    <div className="col-span-1">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Assigned Personnel</div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-bold">
                                {incident.assignedTo ? incident.assignedTo.charAt(0) : 'U'}
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-charcoal truncate">{incident.assignedTo || 'Unassigned'}</div>
                                <div className="text-xs text-gray-500">Field Operator</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Duration</div>
                        <div className="flex items-center gap-2 text-charcoal font-bold font-mono">
                            <Clock className="w-4 h-4 text-gray-400" />
                            00:14:32
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Similar Events (24h)</div>
                        <div className="text-2xl font-bold text-charcoal tracking-tight">{incident.similarEventsCount || 0}</div>
                    </div>
                    <div className="col-span-1">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Audit Trail</div>
                        <div className="text-xs text-gray-500">
                            ID created via auto-detection logic v4.2 at {new Date(incident.timestamp).toLocaleTimeString()}.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CommandCenter: React.FC = () => {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(MOCK_INCIDENTS[0].id);
    const selectedEvent = MOCK_INCIDENTS.find(i => i.id === selectedEventId) || null;

    const activeIncidents = MOCK_INCIDENTS.filter(i => i.status === IncidentStatus.ACTIVE || i.status === IncidentStatus.ACKNOWLEDGED);
    const resolvedIncidents = MOCK_INCIDENTS.filter(i => i.status === IncidentStatus.RESOLVED);

    return (
        <div className="flex flex-col h-auto lg:h-[calc(100vh-8rem)] gap-6 animate-in fade-in duration-500">

            {/* Top Row: KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
                {MOCK_TIER_1_KPIS.map((kpi, idx) => (
                    <KPICard key={idx} kpi={kpi} />
                ))}
                <div className="bg-charcoal text-white rounded-2xl p-6 shadow-card flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System Load</p>
                        <h3 className="text-3xl font-bold">Normal</h3>
                    </div>
                    <div className="relative z-10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-status-success animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-300">All systems operational</span>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 p-4">
                        <Activity className="w-24 h-24" />
                    </div>
                </div>
            </div>

            {/* Main Stage: Master-Detail Layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

                {/* Decision Queue */}
                <div className="w-full lg:w-96 bg-white rounded-2xl shadow-card border border-gray-100 flex flex-col overflow-hidden flex-shrink-0 lg:h-full h-96">
                    <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center z-10 shadow-sm">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Decision Queue</h3>
                        <span className="bg-charcoal text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{activeIncidents.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="bg-gray-50/80 backdrop-blur px-4 py-2 border-b border-gray-100 sticky top-0 z-10">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action Required</span>
                        </div>
                        {activeIncidents.map(incident => (
                            <QueueItem key={incident.id} incident={incident} isSelected={selectedEventId === incident.id} onSelect={() => setSelectedEventId(incident.id)} />
                        ))}
                        <div className="bg-gray-50/80 backdrop-blur px-4 py-2 border-b border-gray-100 border-t sticky top-0 z-10 mt-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monitoring</span>
                        </div>
                        {resolvedIncidents.map(incident => (
                            <QueueItem key={incident.id} incident={incident} isSelected={selectedEventId === incident.id} onSelect={() => setSelectedEventId(incident.id)} />
                        ))}
                    </div>
                </div>

                {/* Mission Control */}
                <div className="flex-1 bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden relative min-h-[500px] lg:min-h-0">
                    <MissionControl incident={selectedEvent} />
                </div>
            </div>
        </div>
    );
};
