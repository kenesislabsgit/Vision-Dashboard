import React from 'react';
import { Shield, Users, FileText, Lock, Plus, Search, MoreHorizontal, Activity, Download } from 'lucide-react';

const USERS = [
    { name: 'John Doe', email: 'j.doe@kenesis.corp', role: 'Ops Director', status: 'Active', lastLogin: '2 mins ago' },
    { name: 'Sarah Connor', email: 's.connor@kenesis.corp', role: 'Security Lead', status: 'Active', lastLogin: '1 hour ago' },
    { name: 'Mike Ross', email: 'm.ross@kenesis.corp', role: 'Analyst', status: 'Away', lastLogin: '3 days ago' },
    { name: 'System Admin', email: 'root@kenesis.corp', role: 'Super Admin', status: 'Active', lastLogin: 'Just now' },
];

const AUDIT_LOGS = [
    { user: 'Sarah Connor', action: 'Changed threshold on Zone B', time: '10:42 AM' },
    { user: 'John Doe', action: 'Acknowledged Incident INC-2024-002', time: '09:15 AM' },
    { user: 'System', action: 'Auto-scaling triggered: +2 Nodes', time: '08:30 AM' },
    { user: 'Mike Ross', action: 'Exported compliance report', time: 'Yesterday' },
];

export const AdminAccess: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
            <div>
                 <h2 className="text-2xl font-bold text-charcoal">Access Control</h2>
                 <p className="text-gray-500 mt-1">Manage user permissions, roles, and view system audit logs.</p>
            </div>
            <div className="flex gap-4">
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-charcoal text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                    <Download className="w-4 h-4" /> Export Logs
                 </button>
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white text-sm font-bold rounded-full hover:bg-black transition-colors shadow-lg">
                    <Plus className="w-4 h-4" /> Add User
                 </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Management Table */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                 <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                     <div className="flex items-center gap-2 text-charcoal font-bold text-sm uppercase tracking-wide">
                         <Users className="w-4 h-4 text-primary" /> Authorized Personnel
                     </div>
                     <div className="relative">
                         <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                         <input type="text" placeholder="Filter users..." className="bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 text-sm rounded-xl focus:outline-none focus:border-primary/50 w-64 transition-all" />
                     </div>
                 </div>
                 
                 <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 text-gray-500 font-medium">
                             <tr>
                                 <th className="px-6 py-4">User</th>
                                 <th className="px-6 py-4">Role</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4 text-right">Last Login</th>
                                 <th className="px-6 py-4 text-right">Actions</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {USERS.map((user, i) => (
                                 <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                     <td className="px-6 py-4">
                                         <div className="font-bold text-charcoal">{user.name}</div>
                                         <div className="text-gray-500 text-xs">{user.email}</div>
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-charcoal text-xs font-bold">
                                             <Shield className="w-3 h-3 text-gray-500" /> {user.role}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-2">
                                             <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-status-success' : 'bg-status-warning'}`}></div>
                                             <span className="text-gray-600 font-medium">{user.status}</span>
                                         </div>
                                     </td>
                                     <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs">
                                         {user.lastLogin}
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                         <button className="text-gray-400 hover:text-charcoal transition-colors p-1 hover:bg-gray-200 rounded-full">
                                             <MoreHorizontal className="w-5 h-5" />
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </div>

            {/* Audit Log Stream */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-card flex flex-col overflow-hidden h-[600px]">
                <div className="p-5 border-b border-gray-100 bg-white">
                     <div className="flex items-center gap-2 text-charcoal font-bold text-sm uppercase tracking-wide">
                         <Lock className="w-4 h-4 text-primary" /> Security Audit Log
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto p-0">
                    {AUDIT_LOGS.map((log, i) => (
                        <div key={i} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-4">
                            <div className="mt-1 relative">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-charcoal">
                                    {log.user.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-charcoal font-medium mb-1 leading-snug">{log.action}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <span className="font-semibold">{log.user}</span> • <span>{log.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-6 text-center">
                        <button className="text-sm font-bold text-primary hover:text-charcoal transition-colors">
                            View All History
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Security Policy Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-charcoal text-white rounded-2xl shadow-card-dark p-6 flex items-start gap-4">
                 <div className="p-3 bg-white/10 rounded-xl">
                     <Lock className="w-6 h-6 text-white" />
                 </div>
                 <div>
                     <div className="text-sm font-bold text-white mb-2">MFA Enforcement</div>
                     <p className="text-xs text-gray-400 leading-relaxed mb-3">Multi-factor authentication is required for all administrative accounts.</p>
                     <div className="text-status-success text-xs font-bold uppercase bg-white/10 inline-block px-2 py-1 rounded">Enabled</div>
                 </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 flex items-start gap-4">
                 <div className="p-3 bg-gray-50 rounded-xl">
                     <Activity className="w-6 h-6 text-charcoal" />
                 </div>
                 <div>
                     <div className="text-sm font-bold text-charcoal mb-2">Session Timeout</div>
                     <p className="text-xs text-gray-500 leading-relaxed mb-3">Inactive sessions auto-terminate after 15 minutes of idle time.</p>
                     <div className="text-charcoal text-xs font-bold uppercase bg-gray-100 inline-block px-2 py-1 rounded">15 Minutes</div>
                 </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 flex items-start gap-4">
                 <div className="p-3 bg-orange-50 rounded-xl">
                     <Shield className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                     <div className="text-sm font-bold text-charcoal mb-2">API Access</div>
                     <p className="text-xs text-gray-500 leading-relaxed mb-3">External API access keys rotate automatically every 30 days.</p>
                     <div className="text-primary text-xs font-bold uppercase bg-orange-50 inline-block px-2 py-1 rounded">Expires in 12d</div>
                 </div>
            </div>
        </div>
    </div>
  );
};