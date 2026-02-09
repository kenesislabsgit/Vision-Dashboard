import React from 'react';
import { GitBranch, Zap, ArrowRight, Bell, Shield, Lock, Activity, Plus, Play } from 'lucide-react';

const WORKFLOWS = [
  {
    id: 'WF-001',
    name: 'Critical Safety Breach Protocol',
    trigger: 'Severity == CRITICAL',
    action: 'Lockdown Zone + SMS Supervisor',
    active: true,
    executions: 124,
    lastRun: '2m ago'
  },
  {
    id: 'WF-002',
    name: 'PPE Compliance Warning',
    trigger: 'Confidence > 90% & Type == PPE',
    action: 'Audio Alert "Wear Hardhat"',
    active: true,
    executions: 1450,
    lastRun: '45s ago'
  },
  {
    id: 'WF-003',
    name: 'Unauthorized After-Hours',
    trigger: 'Time > 20:00 & Zone == Secure',
    action: 'Notify Security + Log Incident',
    active: false,
    executions: 12,
    lastRun: '2d ago'
  },
];

export const Workflows: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-charcoal mb-2">Automation Rules</h2>
           <p className="text-gray-500 max-w-xl">
             Define logic to automatically route incidents, trigger physical actuators, and notify stakeholders.
           </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-charcoal text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl">
            <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflow List */}
        <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 pb-2">
                <span>Active Rules</span>
                <div className="flex gap-16 mr-6">
                   <span>Stats</span>
                   <span>State</span>
                </div>
             </div>
             
             {WORKFLOWS.map((wf) => (
               <div key={wf.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:border-gray-200 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${wf.active ? 'bg-orange-50 text-primary' : 'bg-gray-50 text-gray-400'}`}>
                            <GitBranch className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-charcoal">{wf.name}</h3>
                            <span className="text-xs font-mono text-gray-400">{wf.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                          <div className="text-right">
                              <div className="text-lg font-bold text-charcoal">{wf.executions}</div>
                              <div className="text-xs text-gray-500">runs</div>
                          </div>
                          <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${wf.active ? 'bg-status-success' : 'bg-gray-200'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${wf.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </div>
                      </div>
                  </div>

                  {/* Visualization of Logic */}
                  <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-charcoal">{wf.trigger}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                          <Zap className="w-4 h-4 text-charcoal" />
                          <span className="text-xs font-bold text-charcoal">{wf.action}</span>
                      </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">Last active: {wf.lastRun}</span>
                      <button className="text-xs font-bold text-primary hover:text-charcoal transition-colors flex items-center gap-1">
                          View Logs <ArrowRight className="w-3 h-3" />
                      </button>
                  </div>
               </div>
             ))}
        </div>

        {/* Integration Status Sidebar */}
        <div className="space-y-6">
            <div className="bg-charcoal text-white rounded-2xl shadow-card-dark p-8">
                <h3 className="text-lg font-bold mb-6">Connected Systems</h3>
                
                <div className="space-y-6">
                    {[
                        { name: 'Lenel OnGuard', type: 'Access Control', icon: Shield, color: 'bg-emerald-500' },
                        { name: 'PagerDuty', type: 'Notifications', icon: Bell, color: 'bg-blue-500' },
                        { name: 'Okta SSO', type: 'Authentication', icon: Lock, color: 'bg-orange-500' }
                    ].map((sys, idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/5">
                                    <sys.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{sys.name}</div>
                                    <div className="text-xs text-gray-400">{sys.type}</div>
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${sys.color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <button className="w-full py-3 bg-white text-charcoal text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                        Manage Integrations
                    </button>
                </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-50 rounded-lg text-status-success">
                        <Play className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-bold text-charcoal text-sm">System Healthy</span>
                </div>
                <p className="text-xs text-gray-500">All workflows are executing within nominal latency (avg 45ms).</p>
            </div>
        </div>
      </div>
    </div>
  );
};