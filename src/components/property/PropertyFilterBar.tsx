
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Grid, 
  Table, 
  Map,
} from 'lucide-react';
import { PropertyFilters } from '@/hooks/useProperties';
import { PropertySearchBar } from './filters/PropertySearchBar';
import { PropertyFilterDrawer, FilterOptions } from './filters/PropertyFilterDrawer';
import { SlidersHorizontal } from 'lucide-react';

export type ViewMode = 'grid' | 'table' | 'map';

interface PropertyFilterBarProps {
  onFilter: (filters: PropertyFilters) => void;
  onViewChange: (view: ViewMode) => void;
  currentView: ViewMode;
  filters: PropertyFilters;
}

export function PropertyFilterBar({ 
  onFilter, 
  onViewChange, 
  currentView,
  filters = {}
}: PropertyFilterBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerFilters, setDrawerFilters] = useState<FilterOptions>({
    priceRange: [0, 5000000],
    features: []
  });
  
  // Initialize filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const drawerFiltersCopy = { ...drawerFilters };
    
    if (params.get('minPrice') && params.get('maxPrice')) {
      drawerFiltersCopy.priceRange = [
        Number(params.get('minPrice')),
        Number(params.get('maxPrice'))
      ];
    }
    
    if (params.get('bedrooms')) {
      drawerFiltersCopy.bedrooms = Number(params.get('bedrooms'));
    }
    
    if (params.get('bathrooms')) {
      drawerFiltersCopy.bathrooms = Number(params.get('bathrooms'));
    }
    
    if (params.get('type')) {
      drawerFiltersCopy.type = params.get('type') as any;
    }
    
    setDrawerFilters(drawerFiltersCopy);
  }, [location.search]);
  
  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    // Build filters object
    const newFilters: PropertyFilters = { ...filters };
    
    if (searchTerm) {
      newFilters.title = searchTerm;
    } else {
      delete newFilters.title;
    }
    
    // Pass filters to parent component
    onFilter(newFilters);
  };
  
  // Handle view change
  const handleViewChange = (value: string) => {
    onViewChange(value as ViewMode);
  };
  
  // Handle advanced filters from drawer
  const handleDrawerFiltersChange = (newFilters: FilterOptions) => {
    setDrawerFilters(newFilters);
  };
  
  // Apply advanced filters from drawer
  const handleApplyFilters = () => {
    const updatedFilters: PropertyFilters = { ...filters };
    const params = new URLSearchParams(location.search);
    
    if (drawerFilters.priceRange) {
      updatedFilters.minPrice = drawerFilters.priceRange[0];
      updatedFilters.maxPrice = drawerFilters.priceRange[1];
      
      params.set('minPrice', drawerFilters.priceRange[0].toString());
      params.set('maxPrice', drawerFilters.priceRange[1].toString());
    }
    
    if (drawerFilters.bedrooms !== undefined) {
      updatedFilters.bedrooms = drawerFilters.bedrooms;
      params.set('bedrooms', drawerFilters.bedrooms.toString());
    }
    
    if (drawerFilters.bathrooms !== undefined) {
      updatedFilters.bathrooms = drawerFilters.bathrooms;
      params.set('bathrooms', drawerFilters.bathrooms.toString());
    }
    
    if (drawerFilters.type) {
      updatedFilters.propertyType = drawerFilters.type;
      params.set('type', drawerFilters.type);
    }
    
    // Update URL
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
    
    // Pass filters to parent component
    onFilter(updatedFilters);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    const defaultPriceRange: [number, number] = [0, 5000000];
    setDrawerFilters({
      priceRange: defaultPriceRange,
      features: []
    });
    
    // Remove filter parameters from URL
    const params = new URLSearchParams(location.search);
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('bedrooms');
    params.delete('bathrooms');
    params.delete('type');
    params.delete('features');
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
    
    // Clear filters
    const { title, ...rest } = filters; // Keep search term but clear other filters
    onFilter(title ? { title } : {});
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full justify-between">
      <div className="w-full md:max-w-2xl">
        <PropertySearchBar onSearch={handleSearch} />
      </div>
      
      <div className="flex items-center gap-2">
        <PropertyFilterDrawer 
          filters={drawerFilters}
          onFiltersChange={handleDrawerFiltersChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          trigger={
            <Button variant="outline" size="sm" className="gap-2 h-10">
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          }
        />
        
        <Tabs defaultValue={currentView} onValueChange={handleViewChange}>
          <TabsList>
            <TabsTrigger value="grid">
              <Grid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="table">
              <Table className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
