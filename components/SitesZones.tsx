
import React, { useState, useEffect } from 'react';
import { MOCK_SITES } from '../constants';
import { 
  ChevronRight, ChevronDown, Map as MapIcon, Layers, MoreVertical, 
  Users, AlertCircle, Wind, Activity, 
  Maximize2, MoreHorizontal, Play, Pause,
  Signal, Camera, Crosshair, ZoomIn
} from 'lucide-react';
import { Site, Zone } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- Curated Assets per Zone (2 Feeds per Zone) ---
const ZONE_FEEDS: Record<string, Array<{id: string, url: string, label: string}>> = {
  'ZN-CRANE-01': [
    { id: 'CAM-01', url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop", label: 'Crane Cab View' },
    { id: 'CAM-02', url: "https://images.unsplash.com/photo-1590649803003-2479f64e0d9b?q=80&w=1200&auto=format&fit=crop", label: 'Load Drop Zone' }
  ],
  'ZN-FLOOR-14': [
    { id: 'CAM-03', url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop", label: 'Deck North' },
    { id: 'CAM-04', url: "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?q=80&w=1200&auto=format&fit=crop", label: 'Material Hoist' }
  ],
  'ZN-WELD-BAY': [
    { id: 'CAM-05', url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop", label: 'Arc Bay 1' },
    { id: 'CAM-06', url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop", label: 'Assembly Line' }
  ],
  'default': [
    { id: 'CAM-DEF-1', url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop", label: 'Perimeter Wide' },
    { id: 'CAM-DEF-2', url: "https://images.unsplash.com/photo-1581094794329-cd1096d7a43f?q=80&w=1200&auto=format&fit=crop", label: 'Gate Access' }
  ]
};

// --- Sensor Data Generator ---
const generateSensorData = (base: number, variance: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: base + Math.random() * variance - (variance / 2)
  }));
};

export const SitesZones: React.FC = () => {
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>({ [MOCK_SITES[0].id]: true });
  const [selectedZone, setSelectedZone] = useState<Zone | null>(MOCK_SITES[0].zones[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPaused, setIsPaused] = useState(false);
  
  // Simulated Real-time Data
  const [sensorData, setSensorData] = useState({
    dust: generateSensorData(15, 5),
    noise: generateSensorData(65, 10),
  });

  // Effects for Clock & Data
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (!isPaused) {
        setSensorData(prev => ({
            dust: [...prev.dust.slice(1), { time: Date.now(), value: 15 + Math.random() * 8 }],
            noise: [...prev.noise.slice(1), { time: Date.now(), value: 65 + Math.random() * 15 }],
        }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const toggleSite = (id: string) => {
    setExpandedSites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const feeds = selectedZone && ZONE_FEEDS[selectedZone.id] ? ZONE_FEEDS[selectedZone.id] : ZONE_FEEDS['default'];
  
  // Get current site location for Map
  const currentSite = MOCK_SITES.find(s => s.id === selectedZone?.siteId) || MOCK_SITES[0];
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(currentSite.location)}&t=k&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6 animate-in fade-in">
      
      {/* 1. LEFT: Site Tree & Telemetry */}
      <div className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
          
          {/* Tree Navigation */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 flex flex-col overflow-hidden h-1/2">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-charcoal text-xs uppercase tracking-wider">Project Sites</h3>
                <span className="text-[10px] bg-charcoal text-white px-2 py-0.5 rounded-full font-bold">3 Active</span>
            </div>
            <div className="p-2 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
                {MOCK_SITES.map(site => (
                    <div key={site.id} className="rounded-xl overflow-hidden bg-white">
                        <button 
                            onClick={() => toggleSite(site.id)}
                            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left group ${expandedSites[site.id] ? 'bg-gray-50' : ''}`}
                        >
                            <div className={`p-1 rounded-md transition-colors ${expandedSites[site.id] ? 'text-charcoal' : 'text-gray-400 group-hover:text-charcoal'}`}>
                                {expandedSites[site.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                            <span className="flex-1 text-sm font-bold text-charcoal truncate">{site.name}</span>
                        </button>
                        
                        {expandedSites[site.id] && (
                            <div className="pl-4 pr-2 py-2 space-y-1">
                                {site.zones.map(zone => (
                                    <button 
                                        key={zone.id}
                                        onClick={() => setSelectedZone(zone)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                                            selectedZone?.id === zone.id 
                                            ? 'bg-primary/10 text-primary border border-primary/20' 
                                            : 'text-gray-500 hover:text-charcoal hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedZone?.id === zone.id ? 'bg-primary animate-pulse' : 'bg-gray-300'}`}></div>
                                            {zone.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>

          {/* Environmental Sensors */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 flex flex-col flex-1 p-5 gap-4">
              <h3 className="font-bold text-charcoal text-xs uppercase tracking-wider mb-2">Live Telemetry</h3>
              
              <div className="flex-1 min-h-0 bg-gray-50 rounded-xl p-3 border border-gray-100 relative">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500">Dust (PM2.5)</span>
                    <span className="text-xs font-mono font-bold text-charcoal">{sensorData.dust[sensorData.dust.length-1].value.toFixed(1)} µg</span>
                 </div>
                 <div className="h-full w-full absolute inset-0 pt-8 pb-2 px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sensorData.dust}>
                             <Area type="monotone" dataKey="value" stroke="#6B7280" strokeWidth={2} fill="#E5E7EB" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="flex-1 min-h-0 bg-gray-50 rounded-xl p-3 border border-gray-100 relative">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500">Acoustic (dB)</span>
                    <span className="text-xs font-mono font-bold text-charcoal">{sensorData.noise[sensorData.noise.length-1].value.toFixed(1)} dB</span>
                 </div>
                 <div className="h-full w-full absolute inset-0 pt-8 pb-2 px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sensorData.noise}>
                             <Area type="monotone" dataKey="value" stroke="#FF6B35" strokeWidth={2} fill="#FFEDD5" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
          </div>
      </div>

      {/* 2. RIGHT: Map & Dual Feeds */}
      <div className="flex-1 flex flex-col gap-6 min-h-0">
          
          {/* Interactive Map Header - NOW LIVE SATELLITE MAP */}
          <div className="h-64 bg-white rounded-2xl shadow-card border border-gray-100 relative overflow-hidden group">
               <iframe 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   scrolling="no" 
                   marginHeight={0} 
                   marginWidth={0} 
                   src={mapUrl}
                   className="filter grayscale-[20%] opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
               ></iframe>
               <div className="absolute inset-0 pointer-events-none border-[12px] border-white/50 rounded-2xl"></div>

               {/* Overlay Controls */}
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 pointer-events-none">
                   <MapIcon className="w-4 h-4 text-primary" />
                   <span className="text-xs font-bold text-charcoal">Global Operations Map • {currentSite.location}</span>
               </div>
               <div className="absolute bottom-4 right-4 flex gap-2">
                   <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"><Layers className="w-4 h-4 text-gray-600" /></button>
                   <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"><Crosshair className="w-4 h-4 text-gray-600" /></button>
               </div>
          </div>

          {/* DUAL FEED MONITOR */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
             {feeds.map((feed, idx) => (
                 <div key={feed.id} className="bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-charcoal/50 group">
                      
                      {/* Image Layer with simulated movement */}
                      <div className="absolute inset-0 overflow-hidden">
                          <img 
                              src={feed.url} 
                              alt={feed.label}
                              className={`w-full h-full object-cover transition-transform duration-[20000ms] ease-linear ${isPaused ? 'scale-100' : (idx % 2 === 0 ? 'scale-125 translate-x-10' : 'scale-125 -translate-x-10')}`}
                          />
                      </div>

                      {/* Grain & Scanlines */}
                      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_3px] opacity-10"></div>

                      {/* HUD Overlay */}
                      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <Camera className="w-4 h-4 text-white/70" />
                                  <span className="text-sm font-bold text-white tracking-wide shadow-black drop-shadow-md">{feed.label}</span>
                              </div>
                              <span className="text-[10px] font-mono text-primary font-bold">{feed.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                               <span className="text-[10px] font-bold text-white uppercase tracking-widest">{isPaused ? 'PAUSED' : 'LIVE'}</span>
                          </div>
                      </div>

                      {/* Bottom Controls */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <div className="text-[10px] font-mono text-gray-400">
                               {currentTime.toLocaleTimeString()} • 1080p • 30FPS
                           </div>
                           <div className="flex gap-2">
                               <button 
                                  onClick={() => setIsPaused(!isPaused)}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                               >
                                   {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                               </button>
                               <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors">
                                   <ZoomIn className="w-4 h-4" />
                               </button>
                               <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors">
                                   <Maximize2 className="w-4 h-4" />
                               </button>
                           </div>
                      </div>

                      {/* Fake Object Detection Box */}
                      {!isPaused && idx === 0 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/60 rounded opacity-60 pointer-events-none">
                              <div className="absolute -top-4 left-0 text-[9px] font-bold text-primary bg-black/50 px-1">MOTION</div>
                              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                          </div>
                      )}
                 </div>
             ))}
          </div>
      </div>
    </div>
  );
};
