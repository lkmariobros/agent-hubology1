
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PropertyIndustrialDetails: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const formData = state.formData;
  
  // Type guard to ensure we only access industrial properties
  if (formData.propertyType !== 'Industrial') return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Industrial Property Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="landArea">Land Area (sq ft)</Label>
          <Input
            id="landArea"
            type="number"
            value={formData.landArea || ''}
            onChange={(e) => updateFormData({ landArea: Number(e.target.value) })}
            min={0}
            placeholder="Land area in square feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
          <Input
            id="ceilingHeight"
            type="number"
            value={formData.ceilingHeight || ''}
            onChange={(e) => updateFormData({ ceilingHeight: Number(e.target.value) })}
            min={0}
            step="0.1"
            placeholder="Ceiling height in feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loadingBays">Loading Bays</Label>
          <Input
            id="loadingBays"
            type="number"
            value={formData.loadingBays || ''}
            onChange={(e) => updateFormData({ loadingBays: Number(e.target.value) })}
            min={0}
            placeholder="Number of loading bays"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="powerCapacity">Power Capacity</Label>
          <Input
            id="powerCapacity"
            value={formData.powerCapacity || ''}
            onChange={(e) => updateFormData({ powerCapacity: e.target.value })}
            placeholder="e.g., 800 Amp, 3-Phase"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyIndustrialDetails;
