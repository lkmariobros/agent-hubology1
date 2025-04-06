
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
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

  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      
      {/* Main dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Recent Transactions taking up 2/3 of the space on large screens */}
        <div className="lg:col-span-2">
          <RecentTransactions onViewAll={handleViewAllTransactions} limit={8} />
        </div>
        
        {/* Right side - Metrics */}
        <div className="space-y-6">
          <MetricsContainer metrics={filteredMetrics} className="grid grid-cols-1 gap-4" />
          <UpcomingPayments onViewAll={handleViewAllPayments} />
        </div>
      </div>
      
      {/* Bottom Section */}
      <OpportunitiesBoard onViewAll={handleViewAllOpportunities} />
      
      <PropertyShowcase />
    </div>
  );
};

export default Dashboard;
