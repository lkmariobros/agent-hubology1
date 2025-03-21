
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PropertyList from '@/components/dashboard/PropertyList';
import { DashboardMetric } from '@/types';

const Home = () => {
  // Sample metrics for demonstration
  const metrics: DashboardMetric[] = [
    {
      label: "Total Transactions",
      value: "54",
      change: 12.5,
      trend: "up",
      icon: <span className="text-blue-500">📈</span>
    },
    {
      label: "Commission Earned",
      value: "$87,542",
      change: 8.2,
      trend: "up",
      icon: <span className="text-green-500">💰</span>
    },
    {
      label: "Active Listings",
      value: "32",
      change: -3.1,
      trend: "down",
      icon: <span className="text-orange-500">🏠</span>
    }
  ];

  // Sample transactions
  const transactions = [
    { id: '1', property: { title: 'Luxury Condo', address: { city: 'New York', state: 'NY' } }, price: 750000, status: 'completed', date: '2023-08-15' },
    { id: '2', property: { title: 'Beach House', address: { city: 'Miami', state: 'FL' } }, price: 1200000, status: 'pending', date: '2023-08-10' },
    { id: '3', property: { title: 'Mountain Cabin', address: { city: 'Denver', state: 'CO' } }, price: 450000, status: 'completed', date: '2023-08-05' }
  ];

  // Sample properties
  const properties = [
    { id: '1', title: 'Modern Apartment', address: { city: 'San Francisco', state: 'CA' }, price: 850000, status: 'available' },
    { id: '2', title: 'Victorian House', address: { city: 'Boston', state: 'MA' }, price: 1500000, status: 'available' },
    { id: '3', title: 'Downtown Loft', address: { city: 'Chicago', state: 'IL' }, price: 650000, status: 'pending' },
    { id: '4', title: 'Suburban Home', address: { city: 'Austin', state: 'TX' }, price: 520000, status: 'available' },
    { id: '5', title: 'Beachfront Condo', address: { city: 'San Diego', state: 'CA' }, price: 975000, status: 'available' }
  ];

  const handleViewAll = (section: string) => {
    console.log(`View all ${section}`);
    // Navigation logic would go here
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              metric={metric}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <RecentTransactions 
              transactions={transactions}
              onViewAll={() => handleViewAll('transactions')}
            />
          </div>
          
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Properties</h2>
            <PropertyList 
              properties={properties}
              onViewAll={() => handleViewAll('properties')}
            />
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Opportunities</h2>
          <OpportunitiesBoard 
            onViewAll={() => handleViewAll('opportunities')}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
