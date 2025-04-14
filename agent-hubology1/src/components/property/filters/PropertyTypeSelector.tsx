
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { 
  Building2, 
  Store, 
  Factory, 
  Map 
} from "lucide-react";

export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'land';

interface PropertyTypeSelectorProps {
  selectedType?: PropertyType;
  onTypeChange: (type: PropertyType) => void;
}

export function PropertyTypeSelector({
  selectedType,
  onTypeChange
}: PropertyTypeSelectorProps) {
  return (
    <div className="mb-6">
      <Label className="mb-2 block">Property Type</Label>
      <ToggleGroup type="single" variant="outline" className="justify-start" value={selectedType}>
        <ToggleGroupItem 
          value="residential" 
          onClick={() => onTypeChange('residential')}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Residential
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="commercial" 
          onClick={() => onTypeChange('commercial')}
        >
          <Store className="h-4 w-4 mr-2" />
          Commercial
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="industrial" 
          onClick={() => onTypeChange('industrial')}
        >
          <Factory className="h-4 w-4 mr-2" />
          Industrial
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="land" 
          onClick={() => onTypeChange('land')}
        >
          <Map className="h-4 w-4 mr-2" />
          Land
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
