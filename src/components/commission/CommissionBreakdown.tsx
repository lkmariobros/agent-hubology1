
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
    <Card className="border-[rgba(255,255,255,0.08)] shadow-sm bg-[#1e2028]">
      <CardHeader className="p-6">
        <CardTitle className="text-white">Commission Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[rgba(255,255,255,0.08)]">
            <span className="font-medium text-white">Personal Sales Commission</span>
            <span className="text-xl font-bold text-white">${personalCommission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[rgba(255,255,255,0.08)]">
            <span className="font-medium text-white">Override Commission</span>
            <span className="text-xl font-bold text-white">${overrideCommission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="font-medium text-white">Total Commission (YTD)</span>
            <span className="text-2xl font-bold text-white">${totalCommission.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionBreakdown;
