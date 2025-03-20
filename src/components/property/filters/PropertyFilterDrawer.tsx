
import React from 'react';
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PropertyTypeSelector, PropertyType } from './PropertyTypeSelector';
import { PropertyPriceRange } from './PropertyPriceRange';
import { PropertyRoomsFilter } from './PropertyRoomsFilter';
import { PropertyFeaturesList } from './PropertyFeaturesList';

export interface FilterOptions {
  type?: PropertyType;
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  search?: string;
}

interface PropertyFilterDrawerProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  trigger?: React.ReactNode;
}

export function PropertyFilterDrawer({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  trigger
}: PropertyFilterDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleTypeChange = (type: PropertyType) => {
    onFiltersChange({
      ...filters,
      type
    });
  };

  const handlePriceChange = (priceRange: [number, number]) => {
    onFiltersChange({
      ...filters,
      priceRange
    });
  };

  const handleBedroomChange = (bedrooms: number | undefined) => {
    onFiltersChange({
      ...filters,
      bedrooms
    });
  };

  const handleBathroomChange = (bathrooms: number | undefined) => {
    onFiltersChange({
      ...filters,
      bathrooms
    });
  };

  const handleFeatureToggle = (id: string, checked: boolean) => {
    const currentFeatures = filters.features || [];
    
    onFiltersChange({
      ...filters,
      features: checked 
        ? [...currentFeatures, id] 
        : currentFeatures.filter(f => f !== id)
    });
  };

  const handleApply = () => {
    onApplyFilters();
    setIsOpen(false);
  };

  const handleClear = () => {
    onClearFilters();
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <SlidersHorizontal className="h-4 w-4" />
      Filters
    </Button>
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {trigger || defaultTrigger}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Filter Properties</DrawerTitle>
          <DrawerDescription>
            Adjust filters to find the perfect property
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-2">
          <PropertyTypeSelector 
            selectedType={filters.type} 
            onTypeChange={handleTypeChange} 
          />
          
          <PropertyPriceRange 
            priceRange={filters.priceRange || [0, 5000000]} 
            onPriceChange={handlePriceChange}
          />
          
          <PropertyRoomsFilter 
            bedrooms={filters.bedrooms}
            bathrooms={filters.bathrooms}
            onBedroomChange={handleBedroomChange}
            onBathroomChange={handleBathroomChange}
          />
          
          <PropertyFeaturesList 
            selectedFeatures={filters.features || []}
            onFeatureToggle={handleFeatureToggle}
          />
        </div>
        
        <DrawerFooter>
          <Button onClick={handleApply}>Apply Filters</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClear}>
              Clear Filters
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
