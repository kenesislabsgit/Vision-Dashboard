import React from 'react';
import { DollarSign, Clock, ShieldCheck, TrendingDown, ArrowUpRight } from 'lucide-react';

export const ImpactROI: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in">
        <div className="text-center max-w-2xl mx-auto pt-4 pb-8">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">Value Realization</span>
            <h2 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">Business Impact Overview</h2>
            <p className="text-gray-500 text-lg leading-relaxed">Quantifiable operational improvements driven by Kenesis Vision across all enterprise nodes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="bg-charcoal text-white rounded-2xl p-8 shadow-card-dark relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-5xl font-bold mb-2 tracking-tight">$1.2M</div>
                    <div className="text-sm text-gray-300 font-medium">Annual Costs Avoided</div>
                    <div className="mt-4 inline-flex items-center gap-1 text-status-success bg-white/10 px-2 py-1 rounded text-xs font-bold">
                        <ArrowUpRight className="w-3 h-3" /> 12% vs last year
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-charcoal" />
                </div>
                <div className="text-5xl font-bold text-charcoal mb-2 tracking-tight">450h</div>
                <div className="text-sm text-gray-500 font-medium">Inspection Hours Saved</div>
                <div className="mt-4 inline-flex items-center gap-1 text-status-success bg-green-50 px-2 py-1 rounded text-xs font-bold">
                    <ArrowUpRight className="w-3 h-3" /> 8% efficiency gain
                </div>
             </div>

             <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div className="text-5xl font-bold text-charcoal mb-2 tracking-tight">98.5%</div>
                <div className="text-sm text-gray-500 font-medium">Safety Compliance Score</div>
                <div className="mt-4 inline-flex items-center gap-1 text-status-success bg-green-50 px-2 py-1 rounded text-xs font-bold">
                     All time high
                </div>
             </div>

             <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                    <TrendingDown className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-5xl font-bold text-charcoal mb-2 tracking-tight">-32%</div>
                <div className="text-sm text-gray-500 font-medium">Incident Rate Reduction</div>
                <div className="mt-4 inline-flex items-center gap-1 text-status-success bg-green-50 px-2 py-1 rounded text-xs font-bold">
                    Exceeds target
                </div>
             </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-charcoal">ROI Breakdown by Site</h3>
                <button className="text-sm font-medium text-primary hover:text-charcoal transition-colors">Download Report</button>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-8 py-4">Site Name</th>
                        <th className="px-8 py-4 text-right">Events Processed</th>
                        <th className="px-8 py-4 text-right">Critical Stops</th>
                        <th className="px-8 py-4 text-right">Est. Savings</th>
                        <th className="px-8 py-4 text-right">Trend</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { name: 'Nevada Gigafactory', events: '1,204,500', stops: 4, savings: '$450,000', trend: '+12%' },
                        { name: 'Texas Refining Complex', events: '850,200', stops: 12, savings: '$620,000', trend: '+8%' },
                        { name: 'Detroit Logistics Hub', events: '2,100,000', stops: 1, savings: '$130,000', trend: '+5%' }
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-5 font-bold text-charcoal">{row.name}</td>
                            <td className="px-8 py-5 text-right font-mono text-gray-600">{row.events}</td>
                            <td className="px-8 py-5 text-right font-mono text-charcoal font-medium">{row.stops}</td>
                            <td className="px-8 py-5 text-right text-status-success font-bold">{row.savings}</td>
                            <td className="px-8 py-5 text-right">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-status-success bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight className="w-3 h-3" /> {row.trend}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};