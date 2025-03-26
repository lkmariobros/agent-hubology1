import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, SortDesc, FileText, DollarSign, AlertCircle, CheckCircle2, Clock, ArrowUpDown, ArrowRight } from 'lucide-react';
import PropertiesBoard from '@/components/property/PropertiesBoard';
import OpportunitiesBoard from '@/components/opportunity/OpportunitiesBoard';
import { Property } from '@/types';

const Home = () => {
  const navigate = useNavigate();

  const sampleProperties = [
    { 
      id: 'P-001', 
      title: 'Luxury Villa in Tuscany', 
      description: 'Stunning villa with panoramic views.', 
      price: 2500000, 
      address: { street: 'Via del Sole, 12', city: 'Florence', state: 'Tuscany', zip: '50123', country: 'Italy' }, 
      images: ['/properties/property-1.jpg'], 
      bedrooms: 5, 
      bathrooms: 4, 
      squareFeet: 4500, 
      type: 'residential', 
      status: 'available', 
      featured: true 
    },
    { 
      id: 'P-002', 
      title: 'Modern Apartment in Manhattan', 
      description: 'Sleek apartment in the heart of NYC.', 
      price: 1800000, 
      address: { street: 'Central Park West, 75', city: 'New York', state: 'NY', zip: '10023', country: 'USA' }, 
      images: ['/properties/property-2.jpg'], 
      bedrooms: 2, 
      bathrooms: 2, 
      squareFeet: 1800, 
      type: 'residential', 
      status: 'available', 
      featured: true 
    },
    { 
      id: 'P-003', 
      title: 'Charming Cottage in Cotswolds', 
      description: 'Idyllic retreat in the English countryside.', 
      price: 950000, 
      address: { street: 'High Street, 4', city: 'Cotswolds', state: 'Gloucestershire', zip: 'GL54 1BT', country: 'UK' }, 
      images: ['/properties/property-3.jpg'], 
      bedrooms: 3, 
      bathrooms: 2, 
      squareFeet: 2200, 
      type: 'residential', 
      status: 'available', 
      featured: true 
    },
  ];

  const opportunities = [
    { 
      id: 'O-001', 
      title: 'Investment Opportunity in Downtown LA', 
      description: 'Prime commercial space with high potential.', 
      propertyType: 'commercial', 
      budget: '$5M - $10M', 
      location: 'Los Angeles, CA', 
      status: 'open', 
      postedBy: 'Acme Corp', 
      postedDate: '2023-03-15' 
    },
    { 
      id: 'O-002', 
      title: 'Land Development Project in Austin', 
      description: 'Large plot of land for residential development.', 
      propertyType: 'land', 
      budget: '$2M - $4M', 
      location: 'Austin, TX', 
      status: 'pending', 
      postedBy: 'Beta Builders', 
      postedDate: '2023-03-10' 
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search properties..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <SortDesc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Featured Properties</h2>
            <Button variant="link" size="sm" onClick={() => navigate('/properties')}>
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <PropertiesBoard properties={sampleProperties.map(prop => ({
            ...prop,
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))} />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Latest Opportunities</h2>
            <Button variant="link" size="sm" onClick={() => navigate('/opportunities')}>
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <OpportunitiesBoard opportunities={opportunities} onViewAll={() => navigate('/opportunities')} />
        </div>
      </div>
    </div>
  );
};

export default Home;
