import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import CommissionHeader from '@/components/commission/CommissionHeader';
import CommissionMetrics from '@/components/commission/CommissionMetrics';
import DashboardContent from '@/components/commission/DashboardContent';
import TeamContent from '@/components/commission/TeamContent';
import { useCommissionTiers, useAgentHierarchy } from '@/hooks/useCommission';
import { AgentWithHierarchy, CommissionHistory, CommissionTier } from '@/types';
import SendTestNotification from '@/components/commission/SendTestNotification';

// Sample commission tiers for fallback when API fails
const fallbackTiers: CommissionTier[] = [{
  tier: 'Bronze',
  rate: 20,
  minTransactions: 0,
  color: 'orange'
}, {
  tier: 'Silver',
  rate: 25,
  minTransactions: 10,
  color: 'blue'
}, {
  tier: 'Gold',
  rate: 30,
  minTransactions: 25,
  color: 'orange'
}, {
  tier: 'Platinum',
  rate: 35,
  minTransactions: 50,
  color: 'purple'
}, {
  tier: 'Diamond',
  rate: 40,
  minTransactions: 100,
  color: 'pink'
}];

// Sample agent hierarchy for fallback when API fails
const fallbackAgentHierarchy: AgentWithHierarchy = {
  id: 'agent123',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '+1-555-123-4567',
  avatar: '',
  rank: 'Team Leader',
  joinDate: '2023-01-15',
  transactions: 42,
  salesVolume: 4500000,
  personalCommission: 112500,
  overrideCommission: 45000,
  totalCommission: 157500,
  downline: [{
    id: 'agent456',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '+1-555-987-6543',
    avatar: '',
    rank: 'Sales Leader',
    joinDate: '2023-03-10',
    transactions: 28,
    salesVolume: 2800000,
    personalCommission: 70000,
    overrideCommission: 15000,
    totalCommission: 85000,
    downline: []
  }]
};

// Sample recent commission history (would come from API in production)
const recentCommissions: CommissionHistory[] = [{
  id: '1',
  transactionId: 'tx1',
  property: {
    title: 'Suburban Family Home',
    location: 'Palo Alto, CA'
  },
  date: '2024-02-15T10:30:00Z',
  amount: 22500,
  type: 'personal'
}, {
  id: '2',
  transactionId: 'tx2',
  property: {
    title: 'Downtown Loft',
    location: 'San Francisco, CA'
  },
  date: '2024-02-28T09:15:00Z',
  amount: 30000,
  type: 'personal'
}, {
  id: '3',
  transactionId: 'tx3',
  property: {
    title: 'Luxury Beach Condo',
    location: 'Santa Monica, CA'
  },
  date: '2024-03-10T14:45:00Z',
  amount: 8500,
  type: 'override',
  source: 'Robert Wilson'
}, {
  id: '4',
  transactionId: 'tx4',
  property: {
    title: 'Modern Townhouse',
    location: 'Berkeley, CA'
  },
  date: '2024-03-18T11:20:00Z',
  amount: 6200,
  type: 'override',
  source: 'Emily Davis'
}];

// Sample commission data - would come from API in production
const metricsData = {
  currentMonth: {
    earned: 12750,
    target: 20000,
    progress: 63.75
  },
  previousMonth: {
    earned: 18900,
    target: 20000,
    progress: 94.5
  },
  yearToDate: {
    earned: 89500,
    target: 150000,
    progress: 59.67
  }
};

const Commission = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<AgentWithHierarchy | null>(null);
  const [showTestTools, setShowTestTools] = useState(process.env.NODE_ENV === 'development');

  // Fetch commission data - in production, these would use real API calls
  const {
    data: commissionTiersResponse,
    isLoading: isLoadingTiers
  } = useCommissionTiers();
  
  const {
    data: agentHierarchyResponse,
    isLoading: isLoadingHierarchy
  } = useAgentHierarchy('agent123');

  // Extract and provide fallbacks for API data
  const commissionTiers = commissionTiersResponse || fallbackTiers;
  const agentHierarchy = agentHierarchyResponse || fallbackAgentHierarchy;
  
  const handleAgentClick = (agent: AgentWithHierarchy) => {
    setSelectedAgent(agent);
  };
  
  return (
    <div className="space-y-6 mx-0 px-[50px] py-[20px] my-0">
      <CommissionHeader />
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-2 w-full sm:w-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="team">Team Hierarchy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <CommissionMetrics metrics={metricsData} />
          <DashboardContent 
            commissionTiers={commissionTiers} 
            commissions={recentCommissions} 
            agentHierarchy={agentHierarchy} 
          />
          
          {showTestTools && <SendTestNotification />}
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <TeamContent 
            agentHierarchy={agentHierarchy} 
            selectedAgent={selectedAgent} 
            onAgentClick={handleAgentClick} 
            isLoading={isLoadingHierarchy} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commission;
