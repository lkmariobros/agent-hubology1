
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PropertyLandDetails: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const formData = state.formData;
  
  // Type guard to ensure we only access land properties
  if (formData.propertyType !== 'Land') return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Land Property Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="landSize">Land Size (sq ft)</Label>
          <Input
            id="landSize"
            type="number"
            value={formData.landSize}
            onChange={(e) => updateFormData({ landSize: Number(e.target.value) })}
            min={0}
            placeholder="Land size in square feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zoning">Zoning</Label>
          <Input
            id="zoning"
            value={formData.zoning}
            onChange={(e) => updateFormData({ zoning: e.target.value })}
            placeholder="e.g., Residential, Commercial, Agricultural"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roadFrontage">Road Frontage (ft)</Label>
          <Input
            id="roadFrontage"
            type="number"
            value={formData.roadFrontage}
            onChange={(e) => updateFormData({ roadFrontage: Number(e.target.value) })}
            min={0}
            placeholder="Road frontage in feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topography">Topography</Label>
          <Input
            id="topography"
            value={formData.topography}
            onChange={(e) => updateFormData({ topography: e.target.value })}
            placeholder="e.g., Flat, Sloped, Hilly"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyLandDetails;
