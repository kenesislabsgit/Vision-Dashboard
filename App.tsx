import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { CommandCenter } from './components/CommandCenter';
import { SitesZones } from './components/SitesZones';
import { IncidentsAlerts } from './components/IncidentsAlerts';
import { AnalyticsInsights } from './components/AnalyticsInsights';
import { ImpactROI } from './components/ImpactROI';
import { Workflows } from './components/Workflows';
import { SystemHealth } from './components/SystemHealth';
import { AdminAccess } from './components/AdminAccess';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('command');

  const renderContent = () => {
    switch (activeTab) {
      case 'command': return <CommandCenter />;
      case 'sites': return <SitesZones />;
      case 'incidents': return <IncidentsAlerts />;
      case 'analytics': return <AnalyticsInsights />;
      case 'roi': return <ImpactROI />;
      case 'workflows': return <Workflows />;
      case 'health': return <SystemHealth />;
      case 'admin': return <AdminAccess />;
      default: return <CommandCenter />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;