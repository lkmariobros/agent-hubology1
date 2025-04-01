
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommissionBreakdown from './CommissionBreakdown';
import CommissionHistory from './CommissionHistory';
import CommissionTiers from './CommissionTiers';
import { useAuth } from '@/context/AuthContext';
import { AgentWithHierarchy, CommissionHistory as CommissionHistoryType, CommissionTier } from '@/types';

interface DashboardContentProps {
  commissionTiers: CommissionTier[];
  commissions: CommissionHistoryType[];
  agentHierarchy: AgentWithHierarchy;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  commissionTiers, 
  commissions,
  agentHierarchy
}) => {
  const { user } = useAuth();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
          </CardHeader>
          <CardContent>
            <CommissionHistory commissions={commissions} />
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <CommissionBreakdown 
          personalCommission={agentHierarchy.personalCommission} 
          overrideCommission={agentHierarchy.overrideCommission} 
          totalCommission={agentHierarchy.totalCommission} 
        />
        
        <CommissionTiers 
          tiers={commissionTiers} 
          currentTier="Silver" 
          salesVolume={agentHierarchy.salesVolume} 
        />
      </div>
    </div>
  );
};

export default DashboardContent;
