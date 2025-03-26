
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommissionBreakdown from './CommissionBreakdown';
import CommissionHistory from './CommissionHistory';
import CommissionTiers from './CommissionTiers';
import CommissionNotificationFeed from './CommissionNotificationFeed';
import { useAuth } from '@/hooks/useAuth';
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
        <CommissionNotificationFeed userId={user?.id} limit={3} />
        
        <Card>
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="override">Override</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="pt-4">
                <CommissionHistory commissions={commissions} />
              </TabsContent>
              <TabsContent value="personal" className="pt-4">
                <CommissionHistory 
                  commissions={commissions.filter(c => c.type === 'personal')} 
                />
              </TabsContent>
              <TabsContent value="override" className="pt-4">
                <CommissionHistory 
                  commissions={commissions.filter(c => c.type === 'override')} 
                />
              </TabsContent>
            </Tabs>
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
