
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FeatureOption {
  id: string;
  label: string;
}

interface PropertyFeaturesListProps {
  selectedFeatures: string[];
  onFeatureToggle: (id: string, checked: boolean) => void;
}

export function PropertyFeaturesList({
  selectedFeatures,
  onFeatureToggle
}: PropertyFeaturesListProps) {
  const featureOptions: FeatureOption[] = [
    { id: 'parking', label: 'Parking' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'garden', label: 'Garden' },
    { id: 'security', label: 'Security System' },
    { id: 'gym', label: 'Gym' },
    { id: 'balcony', label: 'Balcony' },
  ];

  return (
    <div className="mb-6">
      <Label className="mb-2 block">Features</Label>
      <div className="grid grid-cols-2 gap-2">
        {featureOptions.map(feature => (
          <div key={feature.id} className="flex items-center space-x-2">
            <Checkbox 
              id={feature.id} 
              checked={selectedFeatures.includes(feature.id)}
              onCheckedChange={(checked) => 
                onFeatureToggle(feature.id, checked as boolean)
              }
            />
            <Label htmlFor={feature.id} className="cursor-pointer">
              {feature.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
