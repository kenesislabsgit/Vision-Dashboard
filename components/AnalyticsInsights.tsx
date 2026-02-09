
import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, AlertCircle, Calendar, MessageSquare, Send, Sparkles, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SAFETY_DATA = [
  { day: 'Mon', incidents: 4, nearMisses: 12 },
  { day: 'Tue', incidents: 3, nearMisses: 8 },
  { day: 'Wed', incidents: 7, nearMisses: 15 },
  { day: 'Thu', incidents: 2, nearMisses: 10 },
  { day: 'Fri', incidents: 5, nearMisses: 14 },
  { day: 'Sat', incidents: 1, nearMisses: 5 },
  { day: 'Sun', incidents: 0, nearMisses: 3 },
];

const COMPLIANCE_TREND = [
  { week: 'W1', score: 88 },
  { week: 'W2', score: 92 },
  { week: 'W3', score: 85 },
  { week: 'W4', score: 94 },
];

const PREDICTIVE_SIGNALS = [
    { title: "Forklift Traffic", desc: "Abnormal density in Zone C predicted to peak at 14:00.", risk: "Medium" },
    { title: "Equipment Fatigue", desc: "Vibration analysis on Unit 4 suggests maintenance needed within 48h.", risk: "High" },
    { title: "Shift Pattern", desc: "Night shift alert volume 15% higher than baseline.", risk: "Low" }
];

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export const AnalyticsInsights: React.FC = () => {
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
      { role: 'ai', content: 'Hello. I am the Kenesis AI Analyst. I have access to all site safety trends, compliance data, and predictive signals. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
      if (!input.trim()) return;
      
      const userMessage = input;
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setIsLoading(true);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Contextualize the data for the AI
          const systemContext = `
            You are the Kenesis AI Analyst, an expert in industrial safety and operations.
            You are analyzing the following real-time dashboard data:
            
            1. Safety Incident Trends (Past 7 Days):
            ${JSON.stringify(SAFETY_DATA)}
            
            2. PPE Compliance Trend (Last 4 Weeks):
            ${JSON.stringify(COMPLIANCE_TREND)}
            
            3. Predictive Risk Signals (Current):
            ${JSON.stringify(PREDICTIVE_SIGNALS)}
            
            Answer the user's questions based on this data. Be concise, professional, and insightful.
            If the user asks about something not in the data, try to infer based on industrial best practices but mention you are estimating.
            Structure your answer with bullet points if explaining trends.
          `;

          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: userMessage,
            config: {
                systemInstruction: systemContext,
            },
          });

          setMessages(prev => [...prev, { role: 'ai', content: response.text || "I couldn't process that request." }]);

      } catch (error) {
          console.error("AI Error", error);
          setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the inference engine. Please try again." }]);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] animate-in fade-in">
        
        {/* LEFT: Charts & Visuals (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Safety Trends */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-charcoal">Safety Incident Trends</h3>
                            <p className="text-sm text-gray-500">Confirmed incidents vs near misses</p>
                        </div>
                        <div className="bg-gray-50 p-1 rounded-lg flex text-xs font-medium text-gray-600">
                            <button className="px-3 py-1 bg-white shadow-sm rounded-md text-charcoal">Weekly</button>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SAFETY_DATA} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="day" tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#F9FAFB'}}
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px', color: '#1A1A1A' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
                                <Bar dataKey="incidents" name="Confirmed" fill="#FF5252" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="nearMisses" name="Near Misses" fill="#E5E7EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Compliance */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-charcoal">PPE Compliance Index</h3>
                            <p className="text-sm text-gray-500">Weekly aggregate score</p>
                        </div>
                        <div className="flex items-center gap-2 text-status-success bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp className="w-3 h-3" /> +4.2%
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={COMPLIANCE_TREND}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="week" tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                                <YAxis domain={[0, 100]} tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#1A1A1A' }} />
                                <Line type="monotone" dataKey="score" stroke="#FF6B35" strokeWidth={3} dot={{r: 4, fill: '#fff', stroke: '#FF6B35', strokeWidth: 2}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Predictive Signals */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal">Predictive Risk Signals</h3>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {PREDICTIVE_SIGNALS.map((item, idx) => (
                        <div key={idx} className="bg-canvas border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition-colors group cursor-pointer">
                            <div className="flex justify-between mb-3">
                                <span className="font-bold text-charcoal text-sm group-hover:text-primary transition-colors">{item.title}</span>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    item.risk === 'High' ? 'bg-red-100 text-status-error' : 
                                    item.risk === 'Medium' ? 'bg-orange-100 text-status-warning' : 
                                    'bg-gray-200 text-gray-600'
                                }`}>
                                    {item.risk}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT: AI Analyst Chat Interface */}
        <div className="w-full lg:w-96 bg-white border border-gray-100 rounded-2xl shadow-card flex flex-col flex-shrink-0 h-full lg:h-auto overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 backdrop-blur flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-charcoal text-white flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-charcoal">AI Intelligence</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse"></span>
                        <span className="text-xs text-gray-500 font-medium">Online • Gemini Flash</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-primary/10 text-primary'
                        }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-charcoal text-white rounded-tr-sm' 
                            : 'bg-white border border-gray-100 text-charcoal shadow-sm rounded-tl-sm'
                        }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about trends, risks, or efficiency..." 
                        className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-charcoal text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-[10px] text-center text-gray-400 mt-2">
                    AI analysis generated by Gemini. Verify critical insights.
                </div>
            </div>
        </div>
    </div>
  );
};
