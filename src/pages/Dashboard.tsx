
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import RoleDebugInfo from '@/components/auth/RoleDebugInfo';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Agent'}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your properties and transactions.
        </p>
      </div>

      {/* Debug information for development */}
      <RoleDebugInfo />

      {/* Dashboard Metrics */}
      <MetricsContainer />
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OpportunitiesBoard />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>

      {/* Property Showcase */}
      <PropertyShowcase />
    </div>
  );
};

export default Dashboard;
