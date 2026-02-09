
import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { Incident, IncidentStatus } from '../types';
import { Filter, Clock, AlertTriangle, PlayCircle, Shield, MoreHorizontal, CheckCircle2, XCircle, FileText, ChevronUp, ChevronDown } from 'lucide-react';

export const IncidentsAlerts: React.FC = () => {
  const [filter, setFilter] = useState<IncidentStatus | 'ALL'>('ALL');
  const [activeIncidents, setActiveIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredIncidents = activeIncidents.filter(i => filter === 'ALL' || i.status === filter);

  // Handlers for "Interactivity"
  const toggleExpand = (id: string) => {
      setExpandedId(prev => prev === id ? null : id);
  };

  const handleStatusChange = (e: React.MouseEvent, id: string, newStatus: IncidentStatus) => {
      e.stopPropagation();
      setActiveIncidents(prev => prev.map(inc => 
          inc.id === id ? { ...inc, status: newStatus } : inc
      ));
  };

  const getStatusStyles = (status: IncidentStatus) => {
    switch (status) {
        case IncidentStatus.ACTIVE: return 'bg-red-100 text-status-error border-red-200';
        case IncidentStatus.ACKNOWLEDGED: return 'bg-orange-100 text-status-warning border-orange-200';
        case IncidentStatus.RESOLVED: return 'bg-green-100 text-status-success border-green-200';
        case IncidentStatus.ESCALATED: return 'bg-purple-100 text-purple-600 border-purple-200';
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-2 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex p-1 gap-1 overflow-x-auto max-w-full">
          {(['ALL', IncidentStatus.ACTIVE, IncidentStatus.ACKNOWLEDGED, IncidentStatus.RESOLVED] as const).map((status) => (
             <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-xl transition-all whitespace-nowrap ${
                    filter === status 
                    ? 'bg-charcoal text-white shadow-md' 
                    : 'text-gray-500 hover:text-charcoal hover:bg-gray-50'
                }`}
             >
                {status === 'ALL' ? 'All Events' : status}
             </button>
          ))}
        </div>
        <div className="flex gap-2 px-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-xs font-bold uppercase text-charcoal rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <Filter className="w-3 h-3 text-gray-400" /> Filter
            </button>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident, idx) => {
            const isExpanded = expandedId === incident.id;
            
            return (
            <div 
                key={incident.id} 
                onClick={() => toggleExpand(incident.id)}
                className={`bg-white border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isExpanded 
                    ? 'rounded-2xl shadow-card-dark border-gray-200 ring-1 ring-charcoal/5' 
                    : 'rounded-xl shadow-card border-gray-100 hover:border-gray-300'
                }`}
            >
                <div className="p-5 flex flex-col md:flex-row gap-6">
                    {/* Visual Evidence Context */}
                    <div className="relative group flex-shrink-0 w-full md:w-64 h-48 md:h-40 rounded-xl overflow-hidden bg-gray-900 shadow-inner">
                        <img 
                            src={incident.imageUrl} 
                            alt="Incident Context" 
                            className={`w-full h-full object-cover transition-transform duration-700 ${isExpanded ? 'scale-110 opacity-60' : 'opacity-90 group-hover:scale-105'}`} 
                        />
                        {/* Overlay Icons */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                            <button className="bg-white text-charcoal rounded-full p-2 shadow-lg transform hover:scale-110 transition-transform">
                                 <PlayCircle className="w-8 h-8 fill-current" />
                            </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold font-mono text-white border border-white/20">
                            {incident.cameraId}
                        </div>
                    </div>

                    {/* Content Summary */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-charcoal leading-tight group-hover:text-primary transition-colors">
                                        {incident.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(incident.timestamp).toLocaleTimeString()}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> {incident.type}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="flex items-center gap-1.5 uppercase"><AlertTriangle className="w-3.5 h-3.5" /> {incident.siteId}</span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(incident.status)}`}>
                                    {incident.status}
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-none">
                                {incident.description}
                            </p>
                        </div>

                        {/* Collapsed/Expanded Action Hint */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px] font-bold">
                                    {(incident.confidence * 100).toFixed(0)}%
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase">AI Confidence</span>
                             </div>
                             {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </div>
                </div>

                {/* EXPANDED DETAILS PANEL */}
                {isExpanded && (
                    <div className="px-5 pb-5 md:pl-[19rem] md:pr-5 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Root Cause Hypothesis</h4>
                                <p className="text-sm font-medium text-charcoal bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                    {incident.rootCauseHypothesis}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">SOP Recommendation</h4>
                                <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-primary hover:text-primary transition-colors">
                                    <FileText className="w-4 h-4" />
                                    {incident.recommendedAction}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200/50">
                             {incident.status === IncidentStatus.ACTIVE ? (
                                 <>
                                    <button 
                                        onClick={(e) => handleStatusChange(e, incident.id, IncidentStatus.RESOLVED)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-charcoal text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" /> False Positive
                                    </button>
                                    <button 
                                        onClick={(e) => handleStatusChange(e, incident.id, IncidentStatus.ACKNOWLEDGED)}
                                        className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white text-xs font-bold rounded-lg hover:bg-black transition-colors shadow-md"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Acknowledge Alert
                                    </button>
                                 </>
                             ) : incident.status === IncidentStatus.ACKNOWLEDGED ? (
                                <button 
                                    onClick={(e) => handleStatusChange(e, incident.id, IncidentStatus.RESOLVED)}
                                    className="flex items-center gap-2 px-6 py-2 bg-status-success text-white text-xs font-bold rounded-lg hover:brightness-110 transition-colors shadow-md"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                                </button>
                             ) : (
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase">
                                    <CheckCircle2 className="w-4 h-4" /> Incident Closed
                                </span>
                             )}
                        </div>
                    </div>
                )}
            </div>
        )})}
      </div>
    </div>
  );
};
