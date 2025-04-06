
import React, { useState } from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FeatureCategory {
  name: string;
  features: string[];
}

const defaultCategories: FeatureCategory[] = [
  {
    name: 'Interior',
    features: [
      'Air Conditioning',
      'Heating',
      'High Ceiling',
      'Built-in Wardrobes',
      'Ensuite',
      'Modern Kitchen',
      'Security System'
    ]
  },
  {
    name: 'Exterior',
    features: [
      'Balcony',
      'Garden',
      'Parking',
      'Swimming Pool',
      'Tennis Court',
      'BBQ Area',
      'Outdoor Entertaining'
    ]
  },
  {
    name: 'Building',
    features: [
      'Elevator',
      'Gym',
      'Security',
      'Sauna',
      'Concierge',
      'Visitor Parking',
      'Communal Areas'
    ]
  }
];

const FeaturesTab: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  const [newFeature, setNewFeature] = useState('');
  const selectedFeatures = formData.propertyFeatures || [];

  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    
    updateFormData({ propertyFeatures: updatedFeatures });
  };

  const handleAddFeature = () => {
    if (newFeature && !selectedFeatures.includes(newFeature)) {
      updateFormData({ propertyFeatures: [...selectedFeatures, newFeature] });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    updateFormData({
      propertyFeatures: selectedFeatures.filter(f => f !== feature)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Property Features</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select existing features or add custom ones for this property
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedFeatures.map(feature => (
            <Badge key={feature} variant="secondary" className="px-3 py-1">
              {feature}
              <X 
                className="ml-2 h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveFeature(feature)}
              />
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 mb-6">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Enter custom feature"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddFeature}
            disabled={!newFeature}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      
      {defaultCategories.map(category => (
        <div key={category.name} className="space-y-3">
          <h3 className="text-md font-medium">{category.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            {category.features.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <label
                  htmlFor={`feature-${feature}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturesTab;
