
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Grid, 
  Table, 
  Map, 
  BuildingIcon, 
  Home, 
  Warehouse, 
  LandPlot, 
  X
} from 'lucide-react';
import { PropertyFilters } from '@/hooks/useProperties';

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
  
  // Initialize state with URL parameters if available
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [propertyType, setPropertyType] = useState(queryParams.get('type') || 'all');
  const [transactionType, setTransactionType] = useState(queryParams.get('transaction') || 'all');
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build filters object
    const filters: PropertyFilters = { };
    
    if (searchTerm) {
      filters.title = searchTerm;
    }
    
    if (propertyType && propertyType !== 'all') {
      filters.propertyType = propertyType;
    }
    
    if (transactionType && transactionType !== 'all') {
      filters.transactionType = transactionType;
    }
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (propertyType !== 'all') params.set('type', propertyType);
    if (transactionType !== 'all') params.set('transaction', transactionType);
    
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
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setPropertyType('all');
    setTransactionType('all');
    
    // Navigate to the page without search parameters
    navigate(location.pathname);
    
    // Reset filters in parent component
    onFilter({});
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <form onSubmit={handleSearch} className="flex gap-2 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={propertyType} 
            onValueChange={setPropertyType}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Residential">
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Residential
                </div>
              </SelectItem>
              <SelectItem value="Commercial">
                <div className="flex items-center">
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  Commercial
                </div>
              </SelectItem>
              <SelectItem value="Industrial">
                <div className="flex items-center">
                  <Warehouse className="mr-2 h-4 w-4" />
                  Industrial
                </div>
              </SelectItem>
              <SelectItem value="Land">
                <div className="flex items-center">
                  <LandPlot className="mr-2 h-4 w-4" />
                  Land
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={transactionType} 
            onValueChange={setTransactionType}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Transaction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="Sale">For Sale</SelectItem>
              <SelectItem value="Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
          
          <Button type="submit">Search</Button>
          
          {(searchTerm || propertyType !== 'all' || transactionType !== 'all') && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      
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
