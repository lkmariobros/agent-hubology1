
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { Building2, Trophy } from 'lucide-react';
import { DashboardMetric } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { useAgentCommission, useAgentLeaderboardPosition, formatCurrency } from '@/hooks/useAgentDashboardMetrics';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: commissionData, isLoading: isLoadingCommission } = useAgentCommission();
  const { leaderboardPosition, isLoading: isLoadingLeaderboard } = useAgentLeaderboardPosition();
  
  // Create metrics based on real data
  const metrics: DashboardMetric[] = [
    {
      id: "commission",
      label: 'Total Commission',
      value: isLoadingCommission ? 'Loading...' : formatCurrency(commissionData?.total || 0),
      change: commissionData?.change || 0,
      trend: (commissionData?.change || 0) >= 0 ? 'up' : 'down',
      icon: <Building2 className="h-5 w-5 text-primary" />
    },
    {
      id: "leaderboard",
      label: 'Leaderboard Position',
      value: isLoadingLeaderboard 
        ? 'Loading...' 
        : (leaderboardPosition.hasTransactions 
            ? `#${leaderboardPosition.position}` 
            : 'Compete to #1'),
      change: leaderboardPosition.change,
      trend: leaderboardPosition.change > 0 ? 'up' : leaderboardPosition.change < 0 ? 'down' : 'neutral',
      icon: <Trophy className="h-5 w-5 text-primary" />
    }
  ];

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
        {/* Left side - Recent Transactions taking up 2/3 (instead of 70%) of the space */}
        <div className="lg:col-span-2">
          <RecentTransactions onViewAll={handleViewAllTransactions} limit={5} />
        </div>
        
        {/* Right side - Metric cards and upcoming payments */}
        <div className="space-y-6 flex flex-col">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className="border-none shadow-md bg-card">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      {metric.icon && (
                        <div className="rounded-full p-2 bg-primary/10 flex items-center justify-center">
                          {metric.icon}
                        </div>
                      )}
                    </div>
                    {metric.change !== undefined && metric.trend !== 'neutral' && (
                      <div className="flex items-center text-sm">
                        <span className={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                          {metric.trend === 'up' ? '+' : ''}{metric.change}%
                        </span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Upcoming Payments */}
          <div className="flex-1">
            <UpcomingPayments onViewAll={handleViewAllPayments} />
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <OpportunitiesBoard onViewAll={handleViewAllOpportunities} />
      
      <PropertyShowcase />
    </div>
  );
};

export default Dashboard;
