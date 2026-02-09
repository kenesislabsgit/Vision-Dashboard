import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Map,
  AlertCircle,
  BrainCircuit,
  BarChart3,
  Activity,
  Bell,
  Search,
  Zap,
  ChevronLeft,
  ChevronRight,
  Settings,
  GitBranch,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'command', label: 'Command Center', icon: LayoutDashboard },
  { id: 'sites', label: 'Operations Map', icon: Map },
  { id: 'incidents', label: 'Incidents', icon: AlertCircle },
  { id: 'analytics', label: 'Intelligence', icon: BrainCircuit },
  { id: 'roi', label: 'Impact', icon: BarChart3 },
  { id: 'workflows', label: 'Workflows', icon: GitBranch },
  { id: 'health', label: 'System', icon: Activity },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-canvas font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-white border-r border-gray-200 flex flex-col flex-shrink-0 
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 bg-white border border-gray-200 text-gray-500 p-1.5 rounded-full hover:text-primary hover:border-primary transition-colors z-50 shadow-sm items-center justify-center"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute right-4 top-4 text-gray-400 hover:text-charcoal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'px-8'}`}>
          {isCollapsed ? (
            <div className="w-8 h-8 bg-charcoal rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
               <Zap className="text-white w-4 h-4 fill-current" />
            </div>
          ) : (
            <div className="animate-in fade-in duration-200">
               <h1 className="text-xl font-bold tracking-tight text-charcoal">Kenesis <span className="text-primary">Vision</span></h1>
            </div>
          )}
        </div>

        <div className="px-4 py-2 overflow-y-auto flex-1 custom-scrollbar">
            {!isCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</p>}
            <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'} py-3 rounded-full text-sm font-medium transition-all duration-200 group relative ${
                        isActive
                            ? 'bg-charcoal text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-charcoal'
                        }`}
                    >
                        <Icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-charcoal'}`} strokeWidth={2} />
                        {!isCollapsed && (
                        <span className="whitespace-nowrap">{item.label}</span>
                        )}
                        
                        {isCollapsed && (
                        <div className="absolute left-14 px-3 py-1.5 bg-charcoal text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                            {item.label}
                        </div>
                        )}
                    </button>
                );
                })}
            </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <button 
            onClick={() => onTabChange('admin')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group text-left`}
          >
             <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-white font-bold text-sm">SC</div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success border-2 border-white rounded-full"></div>
             </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-charcoal truncate">Sarah Connor</p>
                <p className="text-xs text-gray-500 truncate">Head of Ops</p>
              </div>
            )}
            {!isCollapsed && <Settings className="w-4 h-4 text-gray-400 group-hover:text-charcoal" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-canvas/95 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10 sticky top-0 border-b lg:border-none border-gray-200/50">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-charcoal"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg lg:text-2xl font-bold text-charcoal tracking-tight">
                {NAV_ITEMS.find((n) => n.id === activeTab)?.label || (activeTab === 'admin' ? 'Admin & Settings' : 'System')}
              </h2>
              <div className="hidden lg:flex items-center gap-2 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                  <p className="text-sm text-gray-500 font-medium">All systems nominal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative group hidden sm:block">
               <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-charcoal transition-colors" />
               <input 
                  type="text" 
                  placeholder="Search assets..." 
                  className="bg-white border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2 lg:py-2.5 w-48 lg:w-64 text-charcoal focus:outline-none focus:border-charcoal/20 focus:ring-4 focus:ring-gray-100 transition-all placeholder:text-gray-400 shadow-sm"
               />
            </div>
            
            <button className="relative w-9 h-9 lg:w-10 lg:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-charcoal hover:border-gray-300 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-status-error rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 scroll-smooth">
            <div className="max-w-[1920px] mx-auto min-h-full">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};