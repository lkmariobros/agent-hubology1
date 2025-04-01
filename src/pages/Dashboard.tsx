
import React from 'react';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      
      <MetricsContainer />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <UpcomingPayments />
      </div>
      
      <OpportunitiesBoard />
      
      <PropertyShowcase />
    </div>
  );
};

export default Dashboard;
