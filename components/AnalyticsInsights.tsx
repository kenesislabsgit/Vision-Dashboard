import React from 'react';
import { CCTVChat } from './CCTVChat';

export const AnalyticsInsights: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8rem)] -m-4 lg:-m-8">
      <div className="h-full p-4 lg:p-8">
        <CCTVChat />
      </div>
    </div>
  );
};
