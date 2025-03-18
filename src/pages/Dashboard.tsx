
import React from 'react';
import { Building2, DollarSign, TrendingUp, Users } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import PropertyList from '../components/dashboard/PropertyList';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import Leaderboard from '../components/leaderboard/Leaderboard';
import { DashboardMetric, Property, Transaction, User } from '@/types';

// Mock data
const metrics: DashboardMetric[] = [
  {
    label: 'Total Properties',
    value: '124',
    change: 12,
    trend: 'up',
    icon: <Building2 className="h-5 w-5 text-property-blue" />,
  },
  {
    label: 'Active Listings',
    value: '87',
    change: 5,
    trend: 'up',
    icon: <Building2 className="h-5 w-5 text-property-green" />,
  },
  {
    label: 'Monthly Revenue',
    value: '$24,500',
    change: 8,
    trend: 'up',
    icon: <DollarSign className="h-5 w-5 text-property-purple" />,
  },
  {
    label: 'Team Performance',
    value: '94%',
    change: 3,
    trend: 'down',
    icon: <Users className="h-5 w-5 text-property-pink" />,
  },
];

const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Waterfront Villa',
    description: 'Stunning modern villa with direct water access',
    price: 2450000,
    address: {
      street: '123 Oceanview Dr',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA',
    },
    type: 'residential',
    subtype: 'villa',
    features: ['pool', 'waterfront', 'garage'],
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2275&q=80'],
    status: 'available',
    listedBy: 'agent-1',
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z',
  },
  {
    id: '2',
    title: 'Downtown Luxury Penthouse',
    description: 'Exclusive penthouse with panoramic city views',
    price: 3100000,
    address: {
      street: '500 Skyline Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    type: 'residential',
    subtype: 'apartment',
    features: ['concierge', 'gym', 'rooftop'],
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    images: ['https://images.unsplash.com/photo-1565953554309-d181306db7d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2275&q=80'],
    status: 'pending',
    listedBy: 'agent-2',
    createdAt: '2023-02-20T10:15:00Z',
    updatedAt: '2023-03-05T14:30:00Z',
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    description: 'Prime location office in financial district',
    price: 1850000,
    address: {
      street: '350 Business Plaza',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA',
    },
    type: 'commercial',
    subtype: 'office',
    features: ['parking', 'security', 'conference room'],
    area: 1800,
    images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2301&q=80'],
    status: 'available',
    listedBy: 'agent-1',
    createdAt: '2023-03-10T09:45:00Z',
    updatedAt: '2023-03-10T09:45:00Z',
  },
];

const transactions: Transaction[] = [
  {
    id: '1',
    propertyId: '101',
    property: {
      id: '101',
      title: 'Beachfront Condo',
      description: 'Beautiful condo with direct beach access',
      price: 850000,
      address: {
        street: '789 Ocean Dr',
        city: 'Miami',
        state: 'FL',
        zip: '33139',
        country: 'USA',
      },
      type: 'residential',
      subtype: 'condo',
      features: ['beachfront', 'pool', 'gym'],
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      images: ['https://example.com/images/property-101.jpg'],
      status: 'sold',
      listedBy: 'agent-3',
      createdAt: '2023-02-10T08:00:00Z',
      updatedAt: '2023-03-15T14:30:00Z',
    },
    agentId: 'agent-3',
    buyerId: 'buyer-201',
    sellerId: 'seller-301',
    commission: 25500,
    status: 'completed',
    date: '2023-03-15T14:30:00Z',
  },
  {
    id: '2',
    propertyId: '102',
    property: {
      id: '102',
      title: 'Mountain Lodge',
      description: 'Cozy mountain retreat with stunning views',
      price: 720000,
      address: {
        street: '456 Pine Trail',
        city: 'Aspen',
        state: 'CO',
        zip: '81611',
        country: 'USA',
      },
      type: 'residential',
      subtype: 'house',
      features: ['fireplace', 'deck', 'mountain view'],
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      images: ['https://example.com/images/property-102.jpg'],
      status: 'pending',
      listedBy: 'agent-2',
      createdAt: '2023-03-05T10:15:00Z',
      updatedAt: '2023-04-01T11:45:00Z',
    },
    agentId: 'agent-2',
    commission: 21600,
    status: 'pending',
    date: '2023-04-01T11:45:00Z',
  },
  {
    id: '3',
    propertyId: '103',
    property: {
      id: '103',
      title: 'Suburban Family Home',
      description: 'Spacious family home in quiet neighborhood',
      price: 550000,
      address: {
        street: '123 Maple St',
        city: 'Austin',
        state: 'TX',
        zip: '78703',
        country: 'USA',
      },
      type: 'residential',
      subtype: 'house',
      features: ['backyard', 'garage', 'renovated'],
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      images: ['https://example.com/images/property-103.jpg'],
      status: 'sold',
      listedBy: 'agent-1',
      createdAt: '2023-02-28T09:30:00Z',
      updatedAt: '2023-03-25T15:00:00Z',
    },
    agentId: 'agent-1',
    buyerId: 'buyer-203',
    sellerId: 'seller-303',
    commission: 16500,
    status: 'completed',
    date: '2023-03-25T15:00:00Z',
  },
];

const users: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'agent',
    tier: 'senior',
    avatar: 'https://i.pravatar.cc/150?img=1',
    teamId: 'team-1',
  },
  {
    id: 'user-2',
    name: 'Sam Morgan',
    email: 'sam@example.com',
    role: 'agent',
    tier: 'principal',
    avatar: 'https://i.pravatar.cc/150?img=2',
    teamId: 'team-1',
  },
  {
    id: 'user-3',
    name: 'Robin Taylor',
    email: 'robin@example.com',
    role: 'agent',
    tier: 'junior',
    avatar: 'https://i.pravatar.cc/150?img=3',
    teamId: 'team-2',
  },
  {
    id: 'user-4',
    name: 'Jamie Wilson',
    email: 'jamie@example.com',
    role: 'agent',
    tier: 'associate',
    avatar: 'https://i.pravatar.cc/150?img=4',
    teamId: 'team-2',
  },
  {
    id: 'user-5',
    name: 'Casey Brown',
    email: 'casey@example.com',
    role: 'agent',
    tier: 'director',
    avatar: 'https://i.pravatar.cc/150?img=5',
    teamId: 'team-3',
  },
];

const Dashboard = () => {
  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to your agent dashboard
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <MetricCard 
            key={metric.label} 
            metric={metric}
            className={cn("animate-fadeIn")}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <PropertyList properties={properties} />
          <RecentTransactions transactions={transactions} />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <Leaderboard users={users} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
