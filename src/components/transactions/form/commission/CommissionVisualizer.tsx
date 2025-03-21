
import React from 'react';

interface CommissionVisualizerProps {
  agentPercentage: number;
  agencyPercentage: number;
  coBrokingEnabled?: boolean;
  agencySplitPercentage?: number;
  coAgencySplitPercentage?: number;
}

const CommissionVisualizer: React.FC<CommissionVisualizerProps> = ({
  agentPercentage,
  agencyPercentage,
  coBrokingEnabled = false,
  agencySplitPercentage = 50,
  coAgencySplitPercentage = 50
}) => {
  return (
    <div className="mt-4 space-y-3">
      <div>
        <h4 className="text-sm font-medium mb-2">Your Commission Split</h4>
        <div className="h-4 w-full flex rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${agentPercentage}%` }} 
            title={`Your Share: ${agentPercentage}%`}
          ></div>
          <div 
            className="bg-primary h-full" 
            style={{ width: `${agencyPercentage}%` }} 
            title={`Agency: ${agencyPercentage}%`}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          <span>Your Share ({agentPercentage}%)</span>
          <span>Agency ({agencyPercentage}%)</span>
        </div>
      </div>
      
      {coBrokingEnabled && (
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-2">Inter-Agency Split</h4>
          <div className="h-4 w-full flex rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${agencySplitPercentage}%` }} 
              title={`Our Agency: ${agencySplitPercentage}%`}
            ></div>
            <div 
              className="bg-orange-500 h-full" 
              style={{ width: `${coAgencySplitPercentage}%` }} 
              title={`Co-Broker: ${coAgencySplitPercentage}%`}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <span>Our Agency ({agencySplitPercentage}%)</span>
            <span>Co-Broker ({coAgencySplitPercentage}%)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionVisualizer;
