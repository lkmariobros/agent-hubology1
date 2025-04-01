
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate fetching property data from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockProperty = {
          id: id,
          name: 'HHEHEHEH',
          address: 'EF',
          city: 'EFSFSE',
          state: 'FSEF',
          size: 'sqft',
          status: 'Under Offer',
          type: 'Commercial',
          price: '$6,312',
          description: 'Manage all details for this commercial.',
        };
        
        setProperty(mockProperty);
      } catch (e: any) {
        setError(e.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Loading property details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-200 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-md">
        <p className="text-yellow-600">Property not found.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[#121620] text-white">
      {/* Header with breadcrumb and property title */}
      <div className="mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{property.name}</h1>
              <p className="text-gray-400">{property.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <span>Edit</span>
              </Button>
              <Button variant="destructive">
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property image and thumbnails - Left side (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1F2C] rounded-lg overflow-hidden">
              <div className="aspect-[16/9] bg-[#1A1F2C] flex items-center justify-center border border-gray-700 rounded-lg overflow-hidden">
                <p className="text-gray-400">No main image available</p>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div className="aspect-square bg-[#1A1F2C] border border-gray-700 rounded-md"></div>
                <div className="aspect-square bg-[#1A1F2C] border border-gray-700 rounded-md"></div>
                <div className="aspect-square bg-[#1A1F2C] border border-gray-700 rounded-md"></div>
                <div className="aspect-square bg-[#1A1F2C] border border-gray-700 rounded-md"></div>
              </div>
            </div>
          </div>
          
          {/* Property details - Right side (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1F2C] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary">Commercial</Badge>
                <Badge>Sale</Badge>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">{property.price}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400">Property ID:</span>
                  <span>{id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400">Address:</span>
                  <span>{property.address}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400">City:</span>
                  <span>{property.city}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400">State:</span>
                  <span>{property.state}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400">Size:</span>
                  <span>{property.size}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">{property.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs section */}
        <div className="mt-6">
          <Tabs defaultValue="details">
            <TabsList className="bg-[#1A1F2C]">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            {/* Tab content sections */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content - left side (2 cols) */}
              <div className="md:col-span-2">
                {/* Property features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-[#1A1F2C] border-gray-800">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">Property Features</h3>
                      <ul className="space-y-2">
                        {["Feature 1", "Feature 2", "Feature 3"].map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                  
                  <Card className="bg-[#1A1F2C] border-gray-800">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">Building Amenities</h3>
                      <ul className="space-y-2">
                        {["Amenity 1", "Amenity 2", "Amenity 3"].map((amenity, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
              
              {/* Team notes - right side (1 col) */}
              <div className="md:col-span-1">
                <Card className="bg-[#1A1F2C] border-gray-800 h-full">
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-4">Team Notes</h3>
                    <div className="bg-[#161920] rounded-md p-3 mb-3">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                          <span>JS</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Smith</p>
                          <p className="text-xs text-gray-400">commented on</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
