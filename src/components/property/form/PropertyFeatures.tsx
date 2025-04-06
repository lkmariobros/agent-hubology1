
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// Sample features for different property types
const getFeaturesByType = (propertyType: string) => {
  switch (propertyType) {
    case 'Residential':
      return [
        { id: 'central_ac', label: 'Central Air Conditioning' },
        { id: 'hardwood_floors', label: 'Hardwood Floors' },
        { id: 'balcony', label: 'Balcony/Patio' },
        { id: 'pool', label: 'Swimming Pool' },
        { id: 'gym', label: 'Fitness Center' },
        { id: 'security', label: 'Security System' },
        { id: 'pet_friendly', label: 'Pet Friendly' },
        { id: 'storage', label: 'Storage Space' },
        { id: 'parking', label: 'Parking' },
      ];
    case 'Commercial':
      return [
        { id: 'elevator', label: 'Elevator' },
        { id: 'loading_dock', label: 'Loading Dock' },
        { id: 'security_system', label: 'Security System' },
        { id: 'reception', label: 'Reception Area' },
        { id: 'kitchen', label: 'Kitchen/Pantry' },
        { id: 'conference', label: 'Conference Rooms' },
        { id: 'parking', label: 'Parking' },
      ];
    case 'Industrial':
      return [
        { id: 'loading_bays', label: 'Loading Bays' },
        { id: 'dock_high', label: 'Dock-High Doors' },
        { id: 'crane', label: 'Overhead Crane' },
        { id: 'heavy_power', label: 'Heavy Power Supply' },
        { id: 'security', label: 'Security System' },
        { id: 'climate_control', label: 'Climate Control' },
      ];
    case 'Land':
      return [
        { id: 'road_access', label: 'Road Access' },
        { id: 'water_supply', label: 'Water Supply' },
        { id: 'electricity', label: 'Electricity' },
        { id: 'sewage', label: 'Sewage Connection' },
        { id: 'cleared', label: 'Cleared Land' },
        { id: 'fenced', label: 'Fenced' },
      ];
    default:
      return [];
  }
};

const PropertyFeatures: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  
  // Get features based on property type
  const features = getFeaturesByType(formData.propertyType);
  
  // Initialize propertyFeatures array if it doesn't exist
  const propertyFeatures = formData.propertyFeatures || [];
  
  // Handle feature toggle
  const toggleFeature = (featureId: string) => {
    // Create a copy of the current features array
    const currentFeatures = [...propertyFeatures];
    
    // Toggle the feature
    if (currentFeatures.includes(featureId)) {
      // Remove the feature if it's already selected
      const updatedFeatures = currentFeatures.filter(id => id !== featureId);
      updateFormData({ propertyFeatures: updatedFeatures });
    } else {
      // Add the feature if it's not selected
      updateFormData({ propertyFeatures: [...currentFeatures, featureId] });
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Property Features</h3>
          
          <Alert variant="default" className="bg-blue-50 dark:bg-blue-950 mb-4">
            <InfoIcon className="h-4 w-4 mr-2" />
            <AlertDescription>
              Features are for internal reference only. They will be displayed in the property details but are not currently stored in the database.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`feature-${feature.id}`} 
                  checked={propertyFeatures.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
                <Label 
                  htmlFor={`feature-${feature.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFeatures;
