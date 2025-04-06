import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyFormWrapper from '@/components/property/PropertyFormWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import propertyFormHelpers from '@/utils/propertyFormHelpers';
import { PropertyFormData } from '@/types/property-form';

const PropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<Partial<PropertyFormData> | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID is missing');
        setLoading(false);
        return;
      }

      try {
        const property = await propertyFormHelpers.getPropertyById(id);
        
        if (!property) {
          setError('Property not found');
          setLoading(false);
          return;
        }

        // Convert the raw database property to PropertyFormData format
        const formData: Partial<PropertyFormData> = {
          title: property.title,
          description: property.description,
          propertyType: property.property_type_id,
          transactionType: property.transaction_type_id,
          status: property.status_id,
          price: property.price,
          rentalRate: property.rental_rate,
          featured: property.featured,
          address: {
            street: property.street,
            city: property.city,
            state: property.state,
            zip: property.zip,
            country: property.country || 'Malaysia',
          },
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          builtUpArea: property.built_up_area,
          floorArea: property.floor_area,
          landArea: property.land_area,
          landSize: property.land_size,
          furnishingStatus: property.furnishing_status,
          buildingClass: property.building_class,
          ceilingHeight: property.ceiling_height,
          loadingBays: property.loading_bays,
          powerCapacity: property.power_capacity,
          zoning: property.zoning,
          zoningType: property.zoning_type,
          roadFrontage: property.road_frontage,
          topography: property.topography,
          agentNotes: property.agent_notes,
          propertyFeatures: property.features || [],
          images: [],
          documents: []
          // We'll fetch owner contacts separately if needed
        };

        setPropertyData(formData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to fetch property data. Please try again later.');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading property data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Property</CardTitle>
            <CardDescription>Update property information</CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyFormWrapper 
              propertyId={id} 
              initialData={propertyData || undefined}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default PropertyEdit;
