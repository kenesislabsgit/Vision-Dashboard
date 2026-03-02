import React, { useState, useRef, useEffect } from 'react';
import { Camera, Send, Video, Users, CheckCircle, Loader2, AlertCircle, X } from 'lucide-react';

// --- Types ---
interface CameraItem {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
}

interface AnalysisStep {
  id: string;
  label: string;
  detail?: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

interface EvidenceFrame {
  src: string;
  label: string;
}

interface CameraResult {
  cameraId: string;
  cameraName: string;
  location: string;
  summary: string;
  description: string;
  objects: string[];
  frames: EvidenceFrame[];
  personCount: number;
  timeRange: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  steps?: AnalysisStep[];
  results?: CameraResult[];
  anomaly?: boolean;
  tags?: string[];
  isStreaming?: boolean;
}

// --- Mock Cameras ---
const CAMERAS: CameraItem[] = [
  { id: 'main-entrance', name: 'Main Entrance', location: 'Gate A', status: 'online' },
  { id: 'factory-floor', name: 'Factory Floor A', location: 'Floor A', status: 'online' },
  { id: 'storage-room', name: 'Storage Room', location: 'Warehouse B', status: 'online' },
  { id: 'side-gate', name: 'Side Gate', location: 'Gate B', status: 'online' },
];

// --- Mock video thumbnails (use annotated images as frames) ---
const ANNOTATED = {
  CNC: '/annotated_imaes/CNC Vertical Turning Lathe.png',
  MACHINE: '/annotated_imaes/machine.png',
  SHEET: '/annotated_imaes/sheet arranging.png',
  STORE: '/annotated_imaes/store_room_cam.png',
  TOP: '/annotated_imaes/top view cam.png',
};

const SUGGESTED = [
  'What happened at Gate A at 12 PM yesterday?',
  'How many people on Floor A at noon?',
  'Check all cameras for activity at 12 PM',
  'Any anomalies at the warehouse at noon?',
];

// --- Simulate AI analysis ---
async function simulateAnalysis(
  query: string,
  onStepUpdate: (steps: AnalysisStep[]) => void
): Promise<{ results: CameraResult[]; anomaly: boolean; tags: string[] }> {
  const steps: AnalysisStep[] = [
    { id: 'routing', label: 'CAMERA ROUTING', detail: 'Selected: Main Entrance, Storage Room, Side Gate', status: 'pending' },
    { id: 'timestamp', label: 'TIMESTAMP', detail: 'Extracting timestamp for Main Entrance...', status: 'pending' },
    { id: 'footage', label: 'FOOTAGE RETRIEVAL', detail: 'Extracting video clip', status: 'pending' },
    { id: 'vision', label: 'VISION ANALYSIS', detail: 'Analyzing with KenesisBot\'s vision capabilities', status: 'pending' },
  ];

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  steps[0].status = 'running';
  onStepUpdate([...steps]);
  await delay(800);
  steps[0].status = 'done';
  steps[1].status = 'running';
  onStepUpdate([...steps]);
  await delay(900);
  steps[1].status = 'done';
  steps[2].status = 'running';
  onStepUpdate([...steps]);
  await delay(700);
  steps[2].status = 'done';
  steps[3].status = 'running';
  onStepUpdate([...steps]);
  await delay(1200);
  steps[3].status = 'done';
  onStepUpdate([...steps]);

  const results: CameraResult[] = [
    {
      cameraId: 'main-entrance',
      cameraName: 'Main Entrance',
      location: 'Gate A',
      summary: 'One delivery truck (white Freightliner) is visible waiting at the gate during this time period.',
      description: 'The sequence shows a white Freightliner delivery truck waiting at the main gate while a security check is being conducted. A uniformed security officer is checking documentation with the truck driver through the vehicle\'s window. A person (likely facility staff) passes through the turnstile during the security check.',
      objects: ['Delivery truck', 'Security officer', 'Turnstile', 'Gate barrier'],
      frames: [
        { src: ANNOTATED.MACHINE, label: 'Frame 1' },
        { src: ANNOTATED.SHEET, label: 'Frame 2' },
        { src: ANNOTATED.STORE, label: 'Frame 3' },
        { src: ANNOTATED.TOP, label: 'Frame 4' },
      ],
      personCount: 3,
      timeRange: '0s – 8s',
    },
    {
      cameraId: 'storage-room',
      cameraName: 'Storage Room',
      location: 'Warehouse B',
      summary: 'No truck activity observed; only routine internal warehouse operations visible in the storage area.',
      description: 'The footage shows a warehouse worker in a blue uniform and gray beanie conducting inventory or order processing activities in a storage aisle. They are seen examining and handling cardboard boxes on the storage racks, with a forklift visible in the background.',
      objects: ['Warehouse worker', 'Cardboard boxes', 'Storage racks', 'Forklift (in background)', 'Gray beanie hat', 'Blue work uniform', 'Black backpack', 'Wooden pallets'],
      frames: [
        { src: ANNOTATED.STORE, label: 'Frame 1' },
        { src: ANNOTATED.MACHINE, label: 'Frame 2' },
        { src: ANNOTATED.TOP, label: 'Frame 3' },
        { src: ANNOTATED.SHEET, label: 'Frame 4' },
        { src: ANNOTATED.CNC, label: 'Frame 5' },
        { src: ANNOTATED.STORE, label: 'Frame 6' },
        { src: ANNOTATED.MACHINE, label: 'Frame 7' },
      ],
      personCount: 1,
      timeRange: '0s – 8s',
    },
    {
      cameraId: 'side-gate',
      cameraName: 'Side Gate',
      location: 'Gate B',
      summary: 'One delivery van is present at Gate B conducting a package transfer operation at approximately 12:00 PM.',
      description: 'The sequence shows a delivery van parked at Gate B with its rear doors open. Multiple individuals are engaged in what appears to be a legitimate package handling operation. One worker in a blue shirt is seen exchanging or handling packages with another person in a dark hoodie, while a person in a high-visibility vest is visible near the van.',
      objects: ['Delivery van', 'Chain-link fence gate', 'Packages/boxes', 'Power tool on ground', 'Workers in casual clothing', 'Worker in high-visibility vest'],
      frames: [
        { src: ANNOTATED.SHEET, label: 'Frame 1' },
        { src: ANNOTATED.TOP, label: 'Frame 2' },
        { src: ANNOTATED.CNC, label: 'Frame 3' },
        { src: ANNOTATED.MACHINE, label: 'Frame 4' },
        { src: ANNOTATED.STORE, label: 'Frame 5' },
        { src: ANNOTATED.SHEET, label: 'Frame 6' },
        { src: ANNOTATED.TOP, label: 'Frame 7' },
      ],
      personCount: 3,
      timeRange: '0s – 8s',
    },
  ];

  return { results, anomaly: false, tags: ['Main Entrance', 'Storage Room', 'Side Gate'] };
}

// --- Sub-components ---

const StepIcon: React.FC<{ status: AnalysisStep['status'] }> = ({ status }) => {
  if (status === 'done') return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === 'running') return <Loader2 className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />;
  if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
  return <div className="w-4 h-4 rounded-full border border-gray-500 flex-shrink-0" />;
};

const AnalysisCard: React.FC<{ steps: AnalysisStep[] }> = ({ steps }) => (
  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 max-w-sm">
    <div className="flex items-center gap-2 mb-3">
      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
      <span className="text-sm font-semibold text-white">Investigating your query...</span>
    </div>
    <div className="space-y-2.5">
      {steps.map(step => (
        <div key={step.id} className="flex items-start gap-2.5">
          <StepIcon status={step.status} />
          <div>
            <div className={`text-xs font-bold uppercase tracking-wide ${step.status === 'done' ? 'text-gray-400' : step.status === 'running' ? 'text-white' : 'text-gray-600'}`}>
              {step.label}
            </div>
            {step.detail && (
              <div className={`text-xs mt-0.5 ${step.status === 'running' ? 'text-amber-300' : 'text-gray-500'}`}>
                {step.detail}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EvidenceCard: React.FC<{ result: CameraResult; onClear: () => void }> = ({ result, onClear }) => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Video className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-semibold text-gray-800">{result.cameraName} · {result.location}</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
          <X className="w-3 h-3" /> Clear
        </button>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          <span>{result.personCount}</span>
        </div>
      </div>
    </div>

    {/* Frames grid */}
    <div className="p-3">
      <div className="grid grid-cols-4 gap-1.5">
        {result.frames.slice(0, 4).map((frame, i) => (
          <div key={i} className="relative aspect-video bg-gray-100 rounded overflow-hidden">
            <img src={frame.src} alt={frame.label} className="w-full h-full object-cover" />
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
              {frame.label}
            </div>
          </div>
        ))}
      </div>
      {result.frames.length > 4 && (
        <div className="grid grid-cols-4 gap-1.5 mt-1.5">
          {result.frames.slice(4).map((frame, i) => (
            <div key={i} className="relative aspect-video bg-gray-100 rounded overflow-hidden">
              <img src={frame.src} alt={frame.label} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                {frame.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Analysis */}
    <div className="px-4 pb-4 space-y-2">
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Evidence Summary</div>
        <p className="text-sm text-gray-700">{result.summary}</p>
      </div>
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Detailed Description</div>
        <p className="text-xs text-gray-600 leading-relaxed">{result.description}</p>
      </div>
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Objects Detected</div>
        <div className="flex flex-wrap gap-1.5">
          {result.objects.map(obj => (
            <span key={obj} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{obj}</span>
          ))}
        </div>
      </div>
      <div className="text-[10px] text-gray-400 flex items-center gap-1 pt-1">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
        {result.timeRange}
      </div>
    </div>
  </div>
);

const AssistantMessage: React.FC<{ msg: Message; onClearResult: (cameraId: string) => void }> = ({ msg, onClearResult }) => {
  const [clearedCameras, setClearedCameras] = useState<Set<string>>(new Set());

  if (msg.steps && msg.steps.some(s => s.status === 'running' || s.status === 'pending')) {
    return <AnalysisCard steps={msg.steps} />;
  }

  if (msg.results) {
    const visible = msg.results.filter(r => !clearedCameras.has(r.cameraId));
    return (
      <div className="space-y-3 max-w-2xl">
        {/* Summary text */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
          {msg.results.map(r => (
            <p key={r.cameraId} className="text-sm text-gray-700">
              <span className="font-semibold">{r.cameraName} ({r.location}):</span> {r.summary}
            </p>
          ))}
        </div>

        {/* Tags */}
        {msg.tags && (
          <div className="flex flex-wrap gap-2">
            {msg.anomaly !== undefined && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${msg.anomaly ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                {msg.anomaly ? '⚠ Anomaly' : '✓ No Anomaly'}
              </span>
            )}
            {msg.tags.map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Video className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Evidence cards */}
        {visible.map(result => (
          <EvidenceCard
            key={result.cameraId}
            result={result}
            onClear={() => {
              setClearedCameras(prev => new Set([...prev, result.cameraId]));
              onClearResult(result.cameraId);
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 max-w-lg shadow-sm">
      <p className="text-sm text-gray-700">{msg.text}</p>
    </div>
  );
};

// --- Main CCTVChat Component ---
export const CCTVChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query || isLoading) return;
    setInput('');
    setIsLoading(true);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: query };
    const assistantId = (Date.now() + 1).toString();

    const initialSteps: AnalysisStep[] = [
      { id: 'routing', label: 'CAMERA ROUTING', detail: 'Selected: Main Entrance, Storage Room, Side Gate', status: 'pending' },
      { id: 'timestamp', label: 'TIMESTAMP', detail: 'Extracting timestamp for Main Entrance...', status: 'pending' },
      { id: 'footage', label: 'FOOTAGE RETRIEVAL', detail: 'Extracting video clip', status: 'pending' },
      { id: 'vision', label: 'VISION ANALYSIS', detail: "Analyzing with KenesisBot's vision capabilities", status: 'pending' },
    ];

    const assistantMsg: Message = { id: assistantId, role: 'assistant', steps: initialSteps };
    setMessages(prev => [...prev, userMsg, assistantMsg]);

    const { results, anomaly, tags } = await simulateAnalysis(query, (steps) => {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, steps } : m));
    });

    setMessages(prev => prev.map(m =>
      m.id === assistantId
        ? { ...m, steps: undefined, results, anomaly, tags }
        : m
    ));
    setIsLoading(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Camera Sidebar */}
      <aside className="w-48 border-r border-gray-100 flex flex-col flex-shrink-0 bg-white">
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cameras</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {CAMERAS.map(cam => (
            <button
              key={cam.id}
              onClick={() => setSelectedCamera(cam.id === selectedCamera ? null : cam.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedCamera === cam.id ? 'bg-gray-50' : ''}`}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-800 truncate">{cam.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${cam.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-[10px] text-gray-400">{cam.location}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">{CAMERAS.filter(c => c.status === 'online').length} cameras online</p>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">CCTV Intelligence</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Industrial AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            KenesisBot · Live
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Ask about your CCTV footage</h3>
              <p className="text-sm text-gray-500 max-w-xs mb-6">
                Investigate incidents, count people, detect anomalies, and analyze activity across all your cameras — just ask in plain English.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-sm">
                    {msg.text}
                  </div>
                ) : (
                  <AssistantMessage msg={msg} onClearResult={() => {}} />
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <div className={`flex items-end gap-3 border-2 rounded-xl px-4 py-3 transition-colors ${isLoading ? 'border-gray-200' : 'border-amber-400'} bg-white shadow-sm`}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask about any camera or timestamp... e.g. 'What happened at Gate A at 12 PM yesterday?'"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent leading-relaxed"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
                input.trim() && !isLoading
                  ? 'bg-gray-900 text-white hover:bg-black'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};
