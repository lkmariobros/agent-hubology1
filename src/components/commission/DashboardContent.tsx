
import React from 'react';
import { AgentWithHierarchy, CommissionHistory, CommissionTier } from '@/types';
import CommissionHistoryComponent from './CommissionHistory';
import CommissionTiers from './CommissionTiers';
import CommissionBreakdown from './CommissionBreakdown';
import CommissionCalculator from './CommissionCalculator';

interface DashboardContentProps {
  commissionTiers: CommissionTier[];
  commissions: CommissionHistory[];
  agentHierarchy: AgentWithHierarchy;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  commissionTiers,
  commissions,
  agentHierarchy
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommissionHistoryComponent commissions={commissions} />
        </div>
        
        <div>
          <CommissionTiers 
            tiers={commissionTiers} 
            currentTier="Silver" 
            transactionsCompleted={15}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommissionBreakdown
          totalCommission={89500}
          agencyCommission={31000}
          agentCommission={58500}
          personalCommission={58500}
          overrideCommission={31000}
        />
        
        <CommissionCalculator
          agent={agentHierarchy}
          commissionRate={25}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
