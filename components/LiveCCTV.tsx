import React, { useState, useEffect, useRef } from 'react';
import { Video, AlertTriangle, CheckCircle2, Volume2, VolumeX, Clock, Brain, ShieldCheck, X } from 'lucide-react';

// --- Types ---
interface ViolationEvent {
  id: string;
  timestamp: number;
  camera: string;
  violation_confirmed: boolean;
  message: string;
  reasoning: string;
  severity?: 'low' | 'medium' | 'high';
}

// --- Mock camera feeds (using local videos) ---
const CAMERAS = [
  { id: 'cam-1', name: 'Main Entrance – Gate A',   src: '/videos/store_room_cam.mp4' },
  { id: 'cam-2', name: 'Factory Floor A',           src: '/videos/machine.mp4' },
  { id: 'cam-3', name: 'CNC Machining Bay',         src: '/videos/CNC Vertical Turning Lathe.mp4' },
  { id: 'cam-4', name: 'Sheet Arranging Station',   src: '/videos/sheet arranging.mp4' },
];

// --- Simulated violation events from backend ---
const MOCK_EVENTS: Omit<ViolationEvent, 'id' | 'timestamp'>[] = [
  {
    camera: 'Factory Floor A',
    violation_confirmed: false,
    message: 'The AI verification agent determined this was not a real SOP violation. Resuming normal monitoring.',
    reasoning: 'No actual sequence of unsafe actions was detected. Worker movement was within standard operating parameters.',
  },
  {
    camera: 'CNC Machining Bay',
    violation_confirmed: true,
    message: 'SOP violation confirmed: Worker entered restricted zone without PPE clearance.',
    reasoning: 'Worker detected within 0.5m of active CNC spindle without hard hat. Confidence: 94.2%.',
    severity: 'high',
  },
  {
    camera: 'Main Entrance – Gate A',
    violation_confirmed: false,
    message: 'The AI verification agent determined this was not a real SOP violation. Resuming normal monitoring.',
    reasoning: 'No actual sequence of unsafe actions detected. Truck movement matched expected delivery schedule.',
  },
  {
    camera: 'Sheet Arranging Station',
    violation_confirmed: true,
    message: 'SOP violation confirmed: Improper stacking procedure detected.',
    reasoning: 'Sheet metal stacked at angle exceeding 15° from vertical. Risk of toppling. Confidence: 87.5%.',
    severity: 'medium',
  },
];

// --- Video feed tile ---
const FeedTile: React.FC<{
  camera: typeof CAMERAS[0];
  isMain: boolean;
  onClick: () => void;
  hasAlert: boolean;
}> = ({ camera, isMain, onClick, hasAlert }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div
      onClick={onClick}
      className={`relative bg-black rounded-xl overflow-hidden cursor-pointer group border-2 transition-all h-full ${
        isMain ? 'border-blue-500 shadow-lg shadow-blue-500/20' : hasAlert ? 'border-red-500/60 animate-pulse' : 'border-gray-800 hover:border-gray-600'
      }`}
    >
      <video
        ref={videoRef}
        src={camera.src}
        className="w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        autoPlay
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded-md">
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-[10px] font-bold text-white">{isOnline ? 'LIVE' : 'OFFLINE'}</span>
        </div>
        {hasAlert && (
          <div className="flex items-center gap-1 bg-red-600/80 backdrop-blur px-2 py-1 rounded-md">
            <AlertTriangle className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white">ALERT</span>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-white/90 truncate">{camera.name}</span>
        {isMain && (
          <button
            onClick={e => { e.stopPropagation(); setMuted(m => !m); }}
            className="p-1 bg-black/50 rounded text-white hover:bg-black/80 transition-colors"
          >
            {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Scan line effect */}
      {isOnline && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="w-full h-px bg-green-400 animate-[scanline_3s_linear_infinite]" />
        </div>
      )}
    </div>
  );
};

// --- Event log entry ---
const EventLogEntry: React.FC<{ event: ViolationEvent }> = ({ event }) => (
  <div className={`flex items-start gap-3 p-3 border-b border-gray-100 ${event.violation_confirmed ? 'bg-red-50/50' : ''}`}>
    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${event.violation_confirmed ? 'bg-red-100' : 'bg-green-100'}`}>
      {event.violation_confirmed
        ? <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
        : <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
      }
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className="text-xs font-semibold text-gray-700 truncate">{event.camera}</span>
        <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">{new Date(event.timestamp).toLocaleTimeString()}</span>
      </div>
      <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{event.message}</p>
    </div>
  </div>
);

// --- Main LiveCCTV page ---
export const LiveCCTV: React.FC = () => {
  const [mainCam, setMainCam] = useState(CAMERAS[0].id);
  const [latestEvent, setLatestEvent] = useState<ViolationEvent | null>(null);
  const [eventLog, setEventLog] = useState<ViolationEvent[]>([]);
  const [alertCams, setAlertCams] = useState<Set<string>>(new Set());
  const eventIdx = useRef(0);

  // Simulate backend events arriving
  useEffect(() => {
    const fire = () => {
      const mock = MOCK_EVENTS[eventIdx.current % MOCK_EVENTS.length];
      eventIdx.current++;
      const event: ViolationEvent = {
        ...mock,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      setLatestEvent(event);
      setEventLog(prev => [event, ...prev].slice(0, 50));
      if (event.violation_confirmed) {
        const cam = CAMERAS.find(c => c.name === event.camera);
        if (cam) {
          setAlertCams(prev => new Set([...prev, cam.id]));
          setTimeout(() => setAlertCams(prev => { const n = new Set(prev); n.delete(cam.id); return n; }), 10000);
        }
      }
    };

    const t1 = setTimeout(fire, 3000);
    const interval = setInterval(fire, 12000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  const mainCamera = CAMERAS.find(c => c.id === mainCam)!;
  const gridCams = CAMERAS.filter(c => c.id !== mainCam);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 animate-in fade-in duration-500">
      <div className="flex-1 flex gap-4 min-h-0">

        {/* Left: main feed + alert panel */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Main feed */}
          <div className="flex-[55] min-h-0 rounded-xl overflow-hidden">
            <FeedTile
              camera={mainCamera}
              isMain={true}
              onClick={() => {}}
              hasAlert={alertCams.has(mainCam)}
            />
          </div>

          {/* Analysis panel */}
          {latestEvent ? (
            <div className={`flex-[45] min-h-0 rounded-xl border overflow-y-auto custom-scrollbar ${
              latestEvent.violation_confirmed
                ? 'bg-red-950 border-red-700'
                : 'bg-gray-900 border-gray-700'
            }`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 sticky top-0 z-10 ${latestEvent.violation_confirmed ? 'bg-red-900/80 backdrop-blur' : 'bg-gray-800/80 backdrop-blur'}`}>
                <div className="flex items-center gap-2">
                  {latestEvent.violation_confirmed
                    ? <AlertTriangle className="w-5 h-5 text-red-400" />
                    : <CheckCircle2 className="w-5 h-5 text-green-400" />
                  }
                  <span className={`text-sm font-bold uppercase tracking-wide ${latestEvent.violation_confirmed ? 'text-red-300' : 'text-green-300'}`}>
                    {latestEvent.violation_confirmed ? 'Violation Confirmed' : 'False Positive Cleared'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${latestEvent.violation_confirmed ? 'bg-red-800 text-red-200' : 'bg-green-800 text-green-200'}`}>
                    {latestEvent.violation_confirmed ? (latestEvent.severity === 'high' ? 'HIGH SEVERITY' : 'MEDIUM SEVERITY') : 'RESOLVED'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-400">{new Date(latestEvent.timestamp).toLocaleTimeString()}</span>
                  <button onClick={() => setLatestEvent(null)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4 space-y-4">
                {/* Row 1: Detection + AI Reasoning */}
                <div className="flex gap-5">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      <Video className="w-3.5 h-3.5" /> Detection Source
                    </div>
                    <p className={`text-base font-semibold leading-snug ${latestEvent.violation_confirmed ? 'text-red-100' : 'text-gray-200'}`}>
                      {latestEvent.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1.5"><Video className="w-3.5 h-3.5" />{latestEvent.camera}</span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(latestEvent.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="w-px self-stretch bg-gray-700 flex-shrink-0" />

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      <Brain className="w-3.5 h-3.5" /> AI Analysis
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{latestEvent.reasoning}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-medium">
                        Model: KenesisBot v3
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-medium">
                        Latency: {latestEvent.violation_confirmed ? '340ms' : '180ms'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Visual metrics */}
                <div className="grid grid-cols-5 gap-3">
                  {/* Confidence gauge */}
                  <div className="col-span-2 bg-black/30 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Confidence Score</p>
                    <div className="flex items-end gap-3">
                      <span className={`text-3xl font-bold ${latestEvent.violation_confirmed ? 'text-red-300' : 'text-green-300'}`}>
                        {latestEvent.violation_confirmed ? '94.2' : '12.1'}
                        <span className="text-lg">%</span>
                      </span>
                      <span className={`text-[10px] font-semibold mb-1 px-2 py-0.5 rounded ${latestEvent.violation_confirmed ? 'bg-red-900/60 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
                        {latestEvent.violation_confirmed ? 'Above threshold' : 'Below threshold'}
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${latestEvent.violation_confirmed ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-green-700 to-green-400'}`}
                        style={{ width: latestEvent.violation_confirmed ? '94.2%' : '12.1%' }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-600">
                      <span>0%</span><span>Threshold: 70%</span><span>100%</span>
                    </div>
                  </div>

                  {/* Metric cards */}
                  <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${latestEvent.violation_confirmed ? 'bg-red-900/60' : 'bg-green-900/40'}`}>
                      {latestEvent.violation_confirmed
                        ? <AlertTriangle className="w-5 h-5 text-red-400" />
                        : <ShieldCheck className="w-5 h-5 text-green-400" />
                      }
                    </div>
                    <p className={`text-sm font-bold ${latestEvent.violation_confirmed ? 'text-red-300' : 'text-green-300'}`}>
                      {latestEvent.violation_confirmed ? 'VIOLATION' : 'CLEAR'}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Zone</p>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5 bg-blue-900/40">
                      <Video className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-bold text-blue-300">
                      {latestEvent.camera.includes('Floor') ? 'Zone A' : latestEvent.camera.includes('CNC') ? 'Zone B' : latestEvent.camera.includes('Sheet') ? 'Zone C' : 'Gate'}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Response</p>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${latestEvent.violation_confirmed ? 'bg-amber-900/40' : 'bg-gray-800'}`}>
                      <Clock className={`w-5 h-5 ${latestEvent.violation_confirmed ? 'text-amber-400' : 'text-gray-600'}`} />
                    </div>
                    <p className={`text-sm font-bold ${latestEvent.violation_confirmed ? 'text-amber-300' : 'text-gray-600'}`}>
                      {latestEvent.violation_confirmed ? 'PENDING' : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Row 3: Detection timeline visual */}
                <div className="bg-black/30 rounded-xl p-4 space-y-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Detection Timeline</p>
                  <div className="flex items-center gap-2">
                    {['Frame captured', 'Object detection', 'Pose estimation', 'Rule matching', 'AI verification', 'Result'].map((step, i) => {
                      const isActive = true;
                      const isViolation = latestEvent.violation_confirmed;
                      return (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              i === 5
                                ? (isViolation ? 'bg-red-600 text-white' : 'bg-green-600 text-white')
                                : 'bg-gray-700 text-gray-300'
                            }`}>
                              {i + 1}
                            </div>
                            <span className="text-[9px] text-gray-500 text-center leading-tight">{step}</span>
                          </div>
                          {i < 5 && (
                            <div className={`h-0.5 flex-1 rounded ${isViolation ? 'bg-red-800' : 'bg-green-800'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Total processing time: {latestEvent.violation_confirmed ? '340ms' : '180ms'} · 6 pipeline stages completed</span>
                  </div>
                </div>

                {/* Row 4: Recommended action */}
                <div className={`flex items-start gap-3 px-4 py-3 rounded-xl ${latestEvent.violation_confirmed ? 'bg-red-900/30 border border-red-800/50' : 'bg-green-900/20 border border-green-800/30'}`}>
                  {latestEvent.violation_confirmed
                    ? <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    : <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  }
                  <div className="space-y-1">
                    <p className={`text-xs font-bold uppercase tracking-wide ${latestEvent.violation_confirmed ? 'text-red-300' : 'text-green-300'}`}>
                      {latestEvent.violation_confirmed ? 'Recommended Actions' : 'Resolution Summary'}
                    </p>
                    <p className="text-[12px] text-gray-300 leading-relaxed">
                      {latestEvent.violation_confirmed
                        ? `1. Dispatch safety officer to ${latestEvent.camera}. 2. Isolate affected zone and halt operations within 5m radius. 3. Review last 60s of footage for additional context. 4. Incident auto-logged to compliance dashboard (ref: INC-${Date.now().toString().slice(-6)}).`
                        : `AI verification agent ran ${Math.floor(Math.random() * 3) + 2} cross-checks across adjacent cameras and confirmed normal activity patterns. No anomalies detected in worker positioning, equipment state, or environmental conditions. Event archived with false-positive label for model retraining.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-[45] min-h-0 rounded-xl border border-gray-200 bg-white flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No active alerts</p>
              <p className="text-xs text-gray-300 mt-1">AI monitoring is active. Analysis will appear here when events are detected.</p>
            </div>
          )}

        </div>

        {/* Right: event log */}
        <div className="w-72 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">AI Event Log</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Backend violation stream</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-600 font-medium">Live</span>
            </div>
          </div>

          {eventLog.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Clock className="w-8 h-8 text-gray-200 mb-3" />
              <p className="text-xs text-gray-400">Waiting for backend events...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {eventLog.map(e => <EventLogEntry key={e.id} event={e} />)}
            </div>
          )}

          {/* Summary footer */}
          <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{eventLog.filter(e => e.violation_confirmed).length}</div>
                <div className="text-[10px] text-gray-400">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{eventLog.filter(e => !e.violation_confirmed).length}</div>
                <div className="text-[10px] text-gray-400">Cleared</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
