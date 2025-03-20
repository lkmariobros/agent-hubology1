
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommissionBreakdownProps {
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
}

const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({ 
  personalCommission, 
  overrideCommission, 
  totalCommission 
}) => {
  return (
    <Card>
      <CardHeader className="p-5">
        <CardTitle>Commission Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Personal Sales Commission</span>
            <span className="text-xl font-bold">${personalCommission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Override Commission</span>
            <span className="text-xl font-bold">${overrideCommission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium">Total Commission (YTD)</span>
            <span className="text-2xl font-bold">${totalCommission.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionBreakdown;
