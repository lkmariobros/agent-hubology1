import React from 'react';
import { DashboardMetric } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Container from '@/components/ui/container';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import { RightToLeft } from 'lucide-react';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  // Update the metrics to use string values instead of numbers
  const metrics: DashboardMetric[] = [
    {
      id: "total-properties",
      label: "Total Properties",
      value: "156", // Changed from number to string
      change: 12,
      trend: "up",
      status: "active",
      period: "monthly"
    },
    {
      id: "total-agents",
      label: "Total Agents",
      value: "48", // Changed from number to string
      change: 4,
      trend: "up",
      status: "active",
      period: "monthly"
    },
    {
      id: "new-opportunities",
      label: "New Opportunities",
      value: "16", // Changed from number to string
      change: -2,
      trend: "down",
      status: "active",
      period: "monthly"
    },
    {
      id: "average-commission",
      label: "Average Commission",
      value: "$2,350", // Changed from number to string
      change: 8,
      trend: "up",
      status: "active",
      period: "monthly"
    }
  ];

  const sampleProperties = [
    {
      id: "1",
      title: "Luxury Villa with Pool",
      description: "Stunning villa with private pool and ocean views.",
      price: 2500000,
      address: {
        street: "123 Ocean View Dr",
        city: "Malibu",
        state: "CA",
        zip: "90265",
        country: "USA",
      },
      images: [
        "/property-images/luxury-villa-1.webp",
        "/property-images/luxury-villa-2.webp",
      ],
      bedrooms: 5,
      bathrooms: 6,
      squareFeet: 5000,
      type: "Residential",
      status: "available",
      featured: true,
    },
    {
      id: "2",
      title: "Modern Apartment in Downtown",
      description: "Stylish apartment in the heart of downtown.",
      price: 850000,
      address: {
        street: "456 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
      },
      images: [
        "/property-images/modern-apartment-1.webp",
        "/property-images/modern-apartment-2.webp",
      ],
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      type: "Apartment",
      status: "available",
      featured: true,
    },
    {
      id: "3",
      title: "Charming House in the Suburbs",
      description: "Cozy house with a large backyard, perfect for families.",
      price: 620000,
      address: {
        street: "789 Suburban Ln",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "USA",
      },
      images: [
        "/property-images/charming-house-1.webp",
        "/property-images/charming-house-2.webp",
      ],
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      type: "House",
      status: "available",
      featured: false,
    },
  ];

  const sampleUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      role: "agent",
      joinDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      role: "agent",
      joinDate: "2023-02-20",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      role: "agent",
      joinDate: "2023-03-10",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      role: "manager",
      joinDate: "2023-04-05",
    },
  ];

  return (
    <div className="space-y-6">
      <Container>
        <div className="flex items-center justify-between">
          <Card>
            <CardHeader>
              <CardTitle>
                Welcome, {user ? user.name || user.email : "Guest"}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              Here's a snapshot of your dashboard.
            </CardContent>
          </Card>
          <RightToLeft className="mr-2 h-4 w-4" />
        </div>

        <MetricsContainer metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PropertyGrid
              title="Featured Properties"
              properties={sampleProperties}
            />
            <RecentTransactions />
          </div>

          <div className="space-y-6">
            <OpportunitiesBoard />
            <PropertyShowcase />
            <Leaderboard users={sampleUsers} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
