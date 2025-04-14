
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PropertyCommercialDetails: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const formData = state.formData;
  
  // Type guard to ensure we only access commercial properties
  if (formData.propertyType !== 'Commercial') return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Commercial Property Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="floorArea">Floor Area (sq ft)</Label>
          <Input
            id="floorArea"
            type="number"
            value={formData.floorArea}
            onChange={(e) => updateFormData({ floorArea: Number(e.target.value) })}
            min={0}
            placeholder="Floor area in square feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zoningType">Zoning Type</Label>
          <Input
            id="zoningType"
            value={formData.zoningType}
            onChange={(e) => updateFormData({ zoningType: e.target.value })}
            placeholder="e.g., Commercial, Mixed Use"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingClass">Building Class</Label>
          <Select
            value={formData.buildingClass}
            onValueChange={(value) => updateFormData({ buildingClass: value as any })}
          >
            <SelectTrigger id="buildingClass">
              <SelectValue placeholder="Select building class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Class A">Class A</SelectItem>
              <SelectItem value="Class B">Class B</SelectItem>
              <SelectItem value="Class C">Class C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PropertyCommercialDetails;
