
import React from 'react';

interface ProgressIndicatorProps {
  activeTab: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ activeTab }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <div className="text-sm">Essential Info</div>
        <div className="text-sm">Property Details</div>
        <div className="text-sm">Address</div>
        <div className="text-sm">Media</div>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-accent h-2 rounded-full transition-all duration-300" 
          style={{ 
            width: activeTab === "essential" ? "25%" : 
                   activeTab === "details" ? "50%" : 
                   activeTab === "address" ? "75%" : "100%" 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
