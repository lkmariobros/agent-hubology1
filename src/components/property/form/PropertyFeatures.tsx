
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { propertySubtypes, getFeaturesByType } from './schemas/propertyTypes';

const PropertyFeatures: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  
  // Get features based on property type
  const features = getFeaturesByType(formData.propertyType);
  
  // Handle feature toggle
  const toggleFeature = (featureId: string) => {
    // Create a copy of the current features array (or initialize if undefined)
    const currentFeatures = Array.isArray(formData.features) ? [...formData.features] : [];
    
    // Toggle the feature
    if (currentFeatures.includes(featureId)) {
      // Remove the feature if it's already selected
      const updatedFeatures = currentFeatures.filter(id => id !== featureId);
      updateFormData({ features: updatedFeatures });
    } else {
      // Add the feature if it's not selected
      updateFormData({ features: [...currentFeatures, featureId] });
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Property Features</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`feature-${feature.id}`} 
                  checked={formData.features?.includes(feature.id)}
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
