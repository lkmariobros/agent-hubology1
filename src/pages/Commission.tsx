
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommissionHeader from '@/components/commission/CommissionHeader';
import CommissionMetrics from '@/components/commission/CommissionMetrics';
import CommissionHistory from '@/components/commission/CommissionHistory';
import DashboardContent from '@/components/commission/DashboardContent';
import TeamContent from '@/components/commission/TeamContent';
import { useAuth } from '@/hooks/useAuth';
import { AgentWithHierarchy } from '@/types';
import { useTeamManagement } from '@/hooks/useTeamManagement';

const Commission = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin } = useAuth();
  const { 
    teamHierarchy, 
    selectedAgent, 
    handleAgentSelect, 
    isLoadingHierarchy 
  } = useTeamManagement();

  // Sample metrics data for demonstration
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

  // Sample commission data
  const commissionData = {
    personalCommission: 375000,
    overrideCommission: 128000,
    totalCommission: 503000,
    tiers: [
      { id: '1', name: 'Bronze', tier: 'Bronze', rate: 20, minTransactions: 5, color: 'orange', rank: 'Bronze', percentage: 20, commissionRate: 20, requirements: ['$5M in sales'] },
      { id: '2', name: 'Silver', tier: 'Silver', rate: 25, minTransactions: 15, color: 'blue', rank: 'Silver', percentage: 25, commissionRate: 25, requirements: ['$15M in sales'] },
      { id: '3', name: 'Gold', tier: 'Gold', rate: 30, minTransactions: 30, color: 'purple', rank: 'Gold', percentage: 30, commissionRate: 30, requirements: ['$45M in sales'] },
      { id: '4', name: 'Platinum', tier: 'Platinum', rate: 35, minTransactions: 50, color: 'pink', rank: 'Platinum', percentage: 35, commissionRate: 35, requirements: ['$100M in sales'] },
      { id: '5', name: 'Diamond', tier: 'Diamond', rate: 40, minTransactions: 100, color: 'green', rank: 'Diamond', percentage: 40, commissionRate: 40, requirements: ['$250M in sales'] }
    ],
    currentTier: 'Silver',
    salesVolume: 25000000
  };

  // Sample commission history
  const commissionsHistory = [
    {
      id: '1',
      transactionId: 'TRX001',
      property: {
        title: 'Suburban Family Home',
        location: 'Palo Alto, CA'
      },
      date: '2024-02-15',
      amount: 22500,
      type: 'personal',
      status: 'completed'
    },
    {
      id: '2',
      transactionId: 'TRX002',
      property: {
        title: 'Downtown Loft',
        location: 'San Francisco, CA'
      },
      date: '2024-02-28',
      amount: 30000,
      type: 'personal',
      status: 'completed'
    },
    {
      id: '3',
      transactionId: 'TRX003',
      property: {
        title: 'Luxury Beach Condo',
        location: 'Santa Monica, CA'
      },
      date: '2024-03-10',
      amount: 8500,
      type: 'override',
      source: 'Robert Wilson',
      status: 'completed'
    },
    {
      id: '4',
      transactionId: 'TRX004',
      property: {
        title: 'Modern Townhouse',
        location: 'Berkeley, CA'
      },
      date: '2024-03-18',
      amount: 6200,
      type: 'override',
      source: 'Emily Davis',
      status: 'completed'
    }
  ];

  // Sample agent hierarchy for TeamContent
  const agentHierarchy = teamHierarchy || {
    id: '1',
    name: 'John Doe',
    position: 'Team Leader',
    personalCommission: 375000,
    overrideCommission: 128000,
    totalCommission: 503000,
    salesVolume: 25000000,
    team: [
      {
        id: '2',
        name: 'Robert Wilson',
        position: 'Senior Agent',
        commission: 256000,
        salesVolume: 8500000,
      },
      {
        id: '3',
        name: 'Emily Davis',
        position: 'Agent',
        commission: 185000,
        salesVolume: 6200000,
      }
    ]
  };

  return (
    <div className="space-y-6 p-6">
      <CommissionHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="team">Team Hierarchy</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <CommissionMetrics metrics={metricsData} />
          <DashboardContent 
            commissionTiers={commissionData.tiers} 
            commissions={commissionsHistory}
            agentHierarchy={agentHierarchy}
          />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              <CommissionHistory commissions={commissionsHistory} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <TeamContent 
            agentHierarchy={agentHierarchy as AgentWithHierarchy} 
            selectedAgent={selectedAgent} 
            onAgentClick={handleAgentSelect} 
            isLoading={isLoadingHierarchy} 
          />
        </TabsContent>
        
        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle>Commission Forecast</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <iframe 
                src="/commission-forecast" 
                className="w-full h-[600px] border-0" 
                title="Commission Forecast"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commission;
