
import React from 'react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { List, Map } from "lucide-react";

export type ViewMode = 'grid' | 'table' | 'map';

interface PropertyViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function PropertyViewToggle({ 
  currentView, 
  onViewChange 
}: PropertyViewToggleProps) {
  return (
    <ToggleGroup type="single" value={currentView}>
      <ToggleGroupItem 
        value="grid" 
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="table" 
        onClick={() => onViewChange('table')}
        aria-label="Table view"
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="map" 
        onClick={() => onViewChange('map')}
        aria-label="Map view"
      >
        <Map className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
