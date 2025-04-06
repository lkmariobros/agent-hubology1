
import React, { useState } from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FeaturesTab: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  const [featureInput, setFeatureInput] = useState('');
  
  const features = formData.propertyFeatures || [];
  
  const handleAddFeature = () => {
    if (featureInput.trim() === '') return;
    
    const updatedFeatures = [...features, featureInput.trim()];
    updateFormData({ propertyFeatures: updatedFeatures });
    setFeatureInput('');
  };
  
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    updateFormData({ propertyFeatures: updatedFeatures });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="features">Property Features</Label>
        <p className="text-sm text-muted-foreground">
          Add key features that make this property stand out
        </p>
        
        <div className="flex gap-2">
          <Input
            id="features"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a feature (e.g. 'Swimming Pool', 'Garden')"
            className="flex-1"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={handleAddFeature}
            disabled={featureInput.trim() === ''}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      {features.length > 0 && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Added Features</h3>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {feature}
                <button 
                  type="button" 
                  onClick={() => handleRemoveFeature(index)}
                  className="ml-1 hover:text-destructive focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesTab;
