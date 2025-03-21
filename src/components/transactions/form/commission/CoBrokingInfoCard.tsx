
import React from 'react';

interface CoBrokingInfoCardProps {
  enabled: boolean;
  agencySplitPercentage: number;
  coAgencySplitPercentage: number;
}

const CoBrokingInfoCard: React.FC<CoBrokingInfoCardProps> = ({ 
  enabled, 
  agencySplitPercentage, 
  coAgencySplitPercentage 
}) => {
  if (!enabled) return null;
  
  return (
    <div className="bg-muted/50 p-4 rounded-md">
      <h3 className="text-sm font-semibold mb-2">Co-Broking Split</h3>
      <p className="text-xs text-muted-foreground mb-2">
        This property is co-brokered. The commission will be split between agencies before internal splits are calculated.
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm">Our Agency: {agencySplitPercentage}%</span>
        <span className="text-sm">Co-Broker: {coAgencySplitPercentage}%</span>
      </div>
    </div>
  );
};

export default CoBrokingInfoCard;
