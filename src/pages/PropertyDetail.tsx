
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

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
          address: '123 Highland, Someplace CA',
          description: 'A beautiful home with a view.',
          price: '$1,200,000',
          details: {
            bedrooms: 4,
            bathrooms: 3,
            squareFeet: 2500
          }
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
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link 
          to="/properties" 
          className="text-gray-400 hover:text-gray-300 flex items-center mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
      </div>
      
      <div className="bg-[#1F232D] rounded-lg p-6 border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-2">Property Details</h1>
        
        <h2 className="text-3xl font-bold text-white mb-2">{property.address}</h2>
        <p className="text-gray-400 mb-6">{property.description}</p>
        
        <h3 className="text-xl font-semibold text-white mb-4">Price: {property.price}</h3>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Details:</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded p-4">
              <p className="text-gray-400">Bedrooms</p>
              <p className="text-xl font-semibold text-white">{property.details.bedrooms}</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <p className="text-gray-400">Bathrooms</p>
              <p className="text-xl font-semibold text-white">{property.details.bathrooms}</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <p className="text-gray-400">Square Feet</p>
              <p className="text-xl font-semibold text-white">{property.details.squareFeet}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
