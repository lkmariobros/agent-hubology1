
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';
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
        <RecentTransactions />
        <UpcomingPayments onViewAll={handleViewAllPayments} />
      </div>
      
      <OpportunitiesBoard onViewAll={handleViewAllOpportunities} />
      
      <PropertyShowcase />
    </div>
  );
};

export default Dashboard;
