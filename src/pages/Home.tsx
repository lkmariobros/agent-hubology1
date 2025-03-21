
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PropertyList from '@/components/dashboard/PropertyList';

const Home = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Transactions"
            value="54"
            icon="activity"
            trend="up"
            percentage="12.5"
            period="from last month"
          />
          <MetricCard
            title="Commission Earned"
            value="$87,542"
            icon="dollar-sign"
            trend="up"
            percentage="8.2"
            period="from last month"
          />
          <MetricCard
            title="Active Listings"
            value="32"
            icon="home"
            trend="down"
            percentage="3.1"
            period="from last month"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <RecentTransactions />
          </div>
          
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Properties</h2>
            <PropertyList limit={5} />
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Opportunities</h2>
          <OpportunitiesBoard />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
