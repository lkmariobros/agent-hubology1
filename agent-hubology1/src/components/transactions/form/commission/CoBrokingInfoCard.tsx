
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle>Co-Broking Split</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-5 w-full flex rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full" 
            style={{ width: `${agencySplitPercentage}%` }}
          ></div>
          <div 
            className="bg-orange-500 h-full" 
            style={{ width: `${coAgencySplitPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs">
          <span>Our Agency ({agencySplitPercentage}%)</span>
          <span>Co-Broker ({coAgencySplitPercentage}%)</span>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          This transaction includes a co-broker. The commission will be split as shown above.
        </p>
      </CardContent>
    </Card>
  );
};

export default CoBrokingInfoCard;
