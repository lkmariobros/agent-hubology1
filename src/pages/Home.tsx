import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Container } from '@/components/ui/container';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PropertyGrid from '@/components/property/PropertyGrid';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import { DashboardMetric, Transaction } from '@/types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const metrics: DashboardMetric[] = [
    {
      id: 'total-revenue',
      label: 'Total Revenue',
      value: '$2.34M',
      change: 12.5,
      status: 'positive',
      period: 'Last Quarter',
      icon: 'lucide-dollar-sign',
    },
    {
      id: 'new-customers',
      label: 'New Customers',
      value: 456,
      change: -5.2,
      status: 'negative',
      period: 'Last Month',
      icon: 'lucide-user-plus',
    },
    {
      id: 'average-order-value',
      label: 'Average Order Value',
      value: '$567',
      change: 2.3,
      status: 'positive',
      period: 'Last Week',
      icon: 'lucide-shopping-cart',
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      propertyId: 'prop-1',
      agentId: 'agent-1',
      commission: 12500,
      status: 'completed',
      date: '2023-06-15',
      property: {
        title: 'Modern Apartment in Downtown',
        address: {
          city: 'New York',
          state: 'NY'
        }
      },
      price: 450000,
      notes: '',
      closingDate: '2023-07-01',
      buyer: {
        name: 'John Doe'
      },
      seller: {
        name: 'Jane Smith'
      }
    },
    {
      id: '2',
      propertyId: 'prop-2',
      agentId: 'agent-2',
      commission: 9800,
      status: 'pending',
      date: '2023-06-01',
      property: {
        title: 'Spacious House with Garden',
        address: {
          city: 'Los Angeles',
          state: 'CA'
        }
      },
      price: 720000,
      notes: '',
      closingDate: '2023-06-15',
      buyer: {
        name: 'Alice Johnson'
      },
      seller: {
        name: 'Bob Williams'
      }
    },
    {
      id: '3',
      propertyId: 'prop-3',
      agentId: 'agent-1',
      commission: 15200,
      status: 'in progress',
      date: '2023-05-18',
      property: {
        title: 'Luxury Condo with City View',
        address: {
          city: 'Chicago',
          state: 'IL'
        }
      },
      price: 950000,
      notes: '',
      closingDate: '2023-06-01',
      buyer: {
        name: 'Emily Brown'
      },
      seller: {
        name: 'David Wilson'
      }
    }
  ];

  const sampleProperties = [
    {
      id: '1',
      title: 'Luxury Oceanfront Villa',
      description: 'A stunning oceanfront property with panoramic views and direct beach access.',
      price: 4500000,
      address: {
        street: '123 Beachside Drive',
        city: 'Malibu',
        state: 'CA',
        zip: '90265',
        country: 'USA'
      },
      images: ['/images/property1.jpg', '/images/property2.jpg'],
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 5200,
      type: 'Residential',
      status: 'Available',
      featured: true,
    },
    {
      id: '2',
      title: 'Modern Downtown Apartment',
      description: 'A stylish apartment in the heart of the city, close to all amenities.',
      price: 1200000,
      address: {
        street: '456 City Center Plaza',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      images: ['/images/property3.jpg', '/images/property4.jpg'],
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1800,
      type: 'Residential',
      status: 'Under Offer',
      featured: false,
    },
    {
      id: '3',
      title: 'Secluded Mountain Retreat',
      description: 'A cozy cabin nestled in the mountains, perfect for a peaceful getaway.',
      price: 850000,
      address: {
        street: '789 Mountain Road',
        city: 'Aspen',
        state: 'CO',
        zip: '81611',
        country: 'USA'
      },
      images: ['/images/property5.jpg', '/images/property6.jpg'],
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2500,
      type: 'Residential',
      status: 'Available',
      featured: false,
    },
  ];

  return (
    <Container>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {isAdmin ? 'Admin Dashboard' : 'Agent Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            Welcome, {user?.name || 'Agent'}!
          </p>
        </div>

        <MetricsContainer metrics={metrics} />

        <RecentTransactions transactions={mockTransactions} />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold tracking-tight">
              Featured Properties
            </h2>
            <button
              className="text-sm text-primary hover:underline"
              onClick={() => navigate('/properties')}
            >
              View All Properties
            </button>
          </div>
          <PropertyGrid properties={sampleProperties} />
        </div>

        <OpportunitiesBoard />
      </div>
    </Container>
  );
};

export default Home;
