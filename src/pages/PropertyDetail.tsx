import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState(null);
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
    return <p>Loading property details...</p>;
  }
  
  if (error) {
    return <p>Error: {error}</p>;
  }
  
  if (!property) {
    return <p>Property not found.</p>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">{property.address}</h2>
          <p className="text-gray-600">{property.description}</p>
          <p className="text-xl font-semibold mt-4">Price: {property.price}</p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Details:</h3>
            <p>Bedrooms: {property.details.bedrooms}</p>
            <p>Bathrooms: {property.details.bathrooms}</p>
            <p>Square Feet: {property.details.squareFeet}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetail;
