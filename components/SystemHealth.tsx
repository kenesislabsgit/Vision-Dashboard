
import React from 'react';
import { Activity, Cpu, HardDrive, Network, Server, Thermometer, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const LATENCY_DATA = Array.from({ length: 30 }, (_, i) => ({
    time: i,
    value: 12 + Math.random() * 8,
}));

const MetricCard = ({ label, value, unit, icon: Icon, status = 'normal' }: any) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-gray-50 rounded-xl text-charcoal">
                <Icon className="w-6 h-6" />
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${status === 'warning' ? 'bg-orange-100 text-status-warning' : 'bg-green-100 text-status-success'}`}>
                {status === 'warning' ? 'Warning' : 'Good'}
            </div>
        </div>
        <div>
            <div className="text-3xl font-bold text-charcoal mb-1">{value}<span className="text-sm text-gray-400 font-medium ml-1">{unit}</span></div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
        </div>
    </div>
);

export const SystemHealth: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-charcoal">Infrastructure Status</h2>
            <p className="text-gray-500 mt-1">Real-time telemetry from edge nodes and cloud services</p>
          </div>
          <div className="text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 shadow-sm flex items-center gap-2">
             <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
             Operational
          </div>
       </div>

       {/* Top Metrics */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="Global Latency" value="14" unit="ms" icon={Network} />
          <MetricCard label="GPU Utilization" value="88" unit="%" icon={Cpu} status="warning" />
          <MetricCard label="Active Nodes" value="24" unit="/ 24" icon={Server} />
          <MetricCard label="Storage" value="4.2" unit="PB" icon={HardDrive} />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Detailed Performance Graph */}
           <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-card p-8 flex flex-col">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                   <h3 className="text-lg font-bold text-charcoal">Inference Latency (Edge)</h3>
                   <div className="flex gap-2">
                       <span className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-full">Min: 12ms</span>
                       <span className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-full">Max: 24ms</span>
                   </div>
               </div>
               <div className="h-72 flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={LATENCY_DATA}>
                            <defs>
                                <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#FF6B35" strokeWidth={3} fillOpacity={1} fill="url(#colorLat)" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#1A1A1A' }}
                                itemStyle={{ color: '#FF6B35' }}
                                cursor={{ stroke: '#E5E7EB' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
               </div>
           </div>

           {/* Component Status List */}
           <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-8">
               <h3 className="text-lg font-bold text-charcoal mb-6">Service Health</h3>
               <div className="space-y-4">
                   {[
                       { name: 'Identity Service', status: 'Operational', ping: '2ms' },
                       { name: 'Inference Engine A', status: 'High Load', ping: '12ms', warn: true },
                       { name: 'Inference Engine B', status: 'Operational', ping: '11ms' },
                       { name: 'Data Pipeline', status: 'Operational', ping: '45ms' },
                       { name: 'Archival Storage', status: 'Operational', ping: '120ms' },
                       { name: 'API Gateway', status: 'Operational', ping: '5ms' },
                   ].map((svc, idx) => (
                       <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                           <div className="flex items-center gap-3">
                               <CheckCircle2 className={`w-5 h-5 ${svc.warn ? 'text-status-warning' : 'text-status-success'}`} />
                               <span className="text-sm font-semibold text-charcoal">{svc.name}</span>
                           </div>
                           <div className="flex items-center gap-3">
                               <span className={`text-xs font-bold px-2 py-0.5 rounded ${svc.warn ? 'bg-orange-100 text-status-warning' : 'bg-green-100 text-status-success'}`}>{svc.status}</span>
                               <span className="text-xs font-mono text-gray-400 w-12 text-right">{svc.ping}</span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>

       {/* Physical Hardware Grid */}
       <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-8">
           <h3 className="text-lg font-bold text-charcoal mb-6">Edge Node Status</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
               {Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-300 transition-colors">
                       <div className="flex justify-between items-center mb-3">
                           <span className="text-xs font-bold text-gray-500 uppercase">NODE-0{i+1}</span>
                           <div className="w-2 h-2 bg-status-success rounded-full"></div>
                       </div>
                       <div className="flex items-end gap-1 mt-2">
                           <Thermometer className="w-4 h-4 text-gray-400" />
                           <span className="text-sm font-bold text-charcoal font-mono">6{i}°C</span>
                       </div>
                       <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                           <div className="bg-charcoal h-full rounded-full" style={{ width: `${40 + Math.random() * 40}%` }}></div>
                       </div>
                       <div className="mt-1 text-[10px] text-gray-400 text-right">Load</div>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
};
