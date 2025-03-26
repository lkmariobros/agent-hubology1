
import React from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PropertyList from '@/components/dashboard/PropertyList';
import { DashboardMetric, Transaction, Property } from '@/types';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
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
  const transactions: Transaction[] = [
    { 
      id: '1', 
      propertyId: '1',
      agentId: '1',
      commission: 30000,
      status: 'completed', 
      date: '2023-08-15',
      property: { title: 'Luxury Condo', address: { city: 'New York', state: 'NY' } }, 
      price: 750000
    },
    { 
      id: '2', 
      propertyId: '2',
      agentId: '1',
      commission: 48000,
      status: 'pending', 
      date: '2023-08-10',
      property: { title: 'Beach House', address: { city: 'Miami', state: 'FL' } }, 
      price: 1200000
    },
    { 
      id: '3', 
      propertyId: '3',
      agentId: '2',
      commission: 18000,
      status: 'completed', 
      date: '2023-08-05',
      property: { title: 'Mountain Cabin', address: { city: 'Denver', state: 'CO' } }, 
      price: 450000
    }
  ];

  // Sample properties
  const properties: Property[] = [
    { 
      id: '1', 
      title: 'Modern Apartment', 
      description: 'A beautiful modern apartment',
      price: 850000, 
      address: { street: '123 Main St', city: 'San Francisco', state: 'CA', zip: '94101', country: 'USA' }, 
      type: 'residential', 
      subtype: 'apartment',
      features: {
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        landSize: 0
      },
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      images: [],
      status: 'available',
      listedBy: 'Agent 1',
      agent: { id: '1', name: 'Agent 1' },
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      featured: false,
      transactionType: 'Sale'
    },
    { 
      id: '2', 
      title: 'Victorian House', 
      description: 'A classic Victorian home',
      price: 1500000, 
      address: { street: '456 Oak St', city: 'Boston', state: 'MA', zip: '02108', country: 'USA' }, 
      type: 'residential', 
      subtype: 'single-family',
      features: {
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2500,
        landSize: 3500
      },
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      images: [],
      status: 'available',
      listedBy: 'Agent 2',
      agent: { id: '2', name: 'Agent 2' },
      createdAt: '2023-01-02',
      updatedAt: '2023-01-02',
      featured: false,
      transactionType: 'Sale'
    },
    { 
      id: '3', 
      title: 'Downtown Loft', 
      description: 'A spacious downtown loft',
      price: 650000, 
      address: { street: '789 State St', city: 'Chicago', state: 'IL', zip: '60601', country: 'USA' }, 
      type: 'residential', 
      subtype: 'loft',
      features: {
        bedrooms: 1,
        bathrooms: 2,
        squareFeet: 1800,
        landSize: 0
      },
      bedrooms: 1,
      bathrooms: 2,
      area: 1800,
      images: [],
      status: 'pending',
      listedBy: 'Agent 1',
      agent: { id: '1', name: 'Agent 1' },
      createdAt: '2023-01-03',
      updatedAt: '2023-01-03',
      featured: false,
      transactionType: 'Sale'
    }
  ];

  const handleViewAll = (section: string) => {
    console.log(`View all ${section}`);
    if (section === 'transactions') {
      navigate('/transactions');
    } else if (section === 'properties') {
      navigate('/properties');
    } else if (section === 'opportunities') {
      navigate('/opportunities');
    }
  };

  return (
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <RecentTransactions 
            transactions={transactions}
            onViewAll={() => handleViewAll('transactions')}
          />
        </div>
        
        <div>
          <PropertyList 
            properties={properties}
            onViewAll={() => handleViewAll('properties')}
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Opportunities</h2>
        <OpportunitiesBoard 
          onViewAll={() => handleViewAll('opportunities')}
        />
      </div>
    </div>
  );
};

export default Home;
