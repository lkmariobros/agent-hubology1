
import React, { useState } from 'react';
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

export type ViewMode = 'grid' | 'table' | 'map';

interface PropertyFilterBarProps {
  onFilter: (filters: PropertyFilters) => void;
  onViewChange: (view: ViewMode) => void;
  currentView: ViewMode;
}

export function PropertyFilterBar({ 
  onFilter, 
  onViewChange, 
  currentView 
}: PropertyFilterBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get query params from URL
  const queryParams = new URLSearchParams(location.search);
  
  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    // Build filters object
    const filters: PropertyFilters = { };
    
    if (searchTerm) {
      filters.title = searchTerm;
    }
    
    // Update URL with search parameters
    const params = new URLSearchParams(location.search);
    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');
    
    // Navigate to the same page but with search parameters
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    
    // Pass filters to parent component
    onFilter(filters);
  };
  
  // Handle view change
  const handleViewChange = (value: string) => {
    onViewChange(value as ViewMode);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full justify-between">
      <div className="w-full md:max-w-2xl">
        <PropertySearchBar onSearch={handleSearch} />
      </div>
      
      <div className="flex items-center">
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
