
import React from 'react';
import { Building2, BarChart4, Users, DollarSign, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import PropertyList from '@/components/dashboard/PropertyList';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMetrics, useRecentProperties, useRecentTransactions } from '@/hooks/useDashboard';
import { DashboardMetric } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch dashboard data with React Query - using hooks with improved error handling
  const { data: metricsData, isLoading: isLoadingMetrics } = useMetrics();
  const { data: propertiesData, isLoading: isLoadingProperties } = useRecentProperties();
  const { data: transactionsData, isLoading: isLoadingTransactions } = useRecentTransactions();

  // Map the icon names to actual icon components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'building':
        return <Building2 className="h-5 w-5 text-property-orange" />;
      case 'users':
        return <Users className="h-5 w-5 text-property-purple" />;
      case 'dollar':
        return <DollarSign className="h-5 w-5 text-property-pink" />;
      case 'chart':
        return <BarChart4 className="h-5 w-5 text-property-blue" />;
      default:
        return <Building2 className="h-5 w-5 text-property-orange" />;
    }
  };

  // Process metrics data to include icon components - with safe fallbacks
  const metrics: DashboardMetric[] = metricsData?.data?.metrics?.map(metric => ({
    ...metric,
    icon: getIconComponent(metric.icon)
  })) || [];

  // Navigation handlers
  const handleAddProperty = () => {
    navigate('/properties/new');
  };

  const handleAddTransaction = () => {
    navigate('/transactions/new');
  };

  const handleViewAllProperties = () => {
    navigate('/properties');
  };

  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  const handleViewAllOpportunities = () => {
    navigate('/opportunities');
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your agency's performance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddProperty} className="gap-1">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
            <Button onClick={handleAddTransaction} variant="outline" className="gap-1">
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingMetrics ? (
            // Skeleton loading states for metrics
            Array(4).fill(0).map((_, index) => (
              <div 
                key={index} 
                className={cn(
                  "animate-pulse h-32 bg-card/50 rounded-lg",
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                )} 
              />
            ))
          ) : (
            // Actual metrics
            metrics.map((metric, index) => (
              <MetricCard 
                key={metric.label} 
                metric={metric} 
                className={cn(
                  "animate-fade-in",
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                )} 
              />
            ))
          )}
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
          {/* Properties List */}
          <div className="md:col-span-2">
            <PropertyList 
              properties={propertiesData?.data || []} 
              isLoading={isLoadingProperties}
              onViewAll={handleViewAllProperties}
            />
          </div>
          
          {/* Opportunities Board */}
          <div>
            <OpportunitiesBoard 
              onViewAll={handleViewAllOpportunities}
            />
          </div>
          
          {/* Recent Transactions */}
          <div>
            <RecentTransactions 
              transactions={transactionsData?.data || []} 
              isLoading={isLoadingTransactions}
              onViewAll={handleViewAllTransactions}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
