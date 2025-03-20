
import React, { useState } from 'react';
import { PropertySearchBar } from './filters/PropertySearchBar';
import { PropertyViewToggle, ViewMode } from './filters/PropertyViewToggle';
import { PropertyFilterDrawer, FilterOptions } from './filters/PropertyFilterDrawer';

// Export ViewMode type so it can be imported in other files
export type { ViewMode } from './filters/PropertyViewToggle';

interface PropertyFilterBarProps {
  onFilter: (filters: FilterOptions) => void;
  onViewChange: (view: ViewMode) => void;
  currentView: ViewMode;
}

export function PropertyFilterBar({ 
  onFilter, 
  onViewChange, 
  currentView = 'grid' 
}: PropertyFilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 5000000],
    features: []
  });

  const handleSearch = (query: string) => {
    setFilters({
      ...filters,
      search: query || undefined
    });
    
    onFilter({
      ...filters,
      search: query || undefined
    });
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    // Explicitly define as a tuple to match the expected type
    const defaultPriceRange: [number, number] = [0, 5000000];
    
    const clearedFilters: FilterOptions = {
      priceRange: defaultPriceRange,
      features: []
    };
    
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <PropertySearchBar onSearch={handleSearch} />
        
        {/* View toggle - visible on both mobile and desktop */}
        <div className="flex items-center">
          <PropertyViewToggle 
            currentView={currentView} 
            onViewChange={onViewChange} 
          />
        </div>
        
        {/* Mobile filters button */}
        <div className="flex items-center">
          <PropertyFilterDrawer 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
}
