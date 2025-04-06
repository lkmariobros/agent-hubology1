
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import { useMetrics } from '@/hooks/useDashboard';
import { Building2, Trophy } from 'lucide-react';
import { DashboardMetric } from '@/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: metricsData } = useMetrics();
  
  // Filter to only show two specific metrics
  const filteredMetrics: DashboardMetric[] = metricsData?.data?.metrics 
    ? [
        {
          id: "commission",
          label: 'Total Commission',
          value: '$45,682',
          change: 8.2,
          trend: 'up' as const,  // Using 'as const' to ensure it's one of the union types
          icon: <Building2 className="h-5 w-5 text-primary" />
        },
        {
          id: "leaderboard",
          label: 'Leaderboard Position',
          value: '#3',
          change: 2,
          trend: 'up' as const,  // Using 'as const' to ensure it's one of the union types
          icon: <Trophy className="h-5 w-5 text-primary" />
        }
      ]
    : [];

  const handleViewAllOpportunities = () => {
    navigate('/opportunities');
  };
  
  const handleViewAllPayments = () => {
    navigate('/commissions/forecast');
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      
      <MetricsContainer metrics={filteredMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Leaderboard 
          users={[
            { id: '1', name: 'Jane Smith', role: 'agent', tier: 'Gold', avatar: '', email: 'jane.smith@example.com' },
            { id: '2', name: 'John Doe', role: 'agent', tier: 'Silver', avatar: '', email: 'john.doe@example.com' },
            { id: '3', name: 'Alice Johnson', role: 'agent', tier: 'Bronze', avatar: '', email: 'alice.johnson@example.com' },
            { id: '4', name: 'Robert Lee', role: 'agent', tier: 'Gold', avatar: '', email: 'robert.lee@example.com' },
            { id: '5', name: 'Emily Wang', role: 'agent', tier: 'Silver', avatar: '', email: 'emily.wang@example.com' },
          ]} 
        />
        <UpcomingPayments onViewAll={handleViewAllPayments} />
      </div>
      
      <OpportunitiesBoard onViewAll={handleViewAllOpportunities} />
      
      <PropertyShowcase />
    </div>
  );
};

export default Dashboard;
