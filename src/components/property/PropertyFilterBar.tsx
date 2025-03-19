
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronDown, 
  Building2, 
  Store, 
  Factory, 
  Map, 
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";

type PropertyType = 'residential' | 'commercial' | 'industrial' | 'land';

interface FilterOptions {
  type?: PropertyType;
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  search?: string;
}

interface PropertyFilterBarProps {
  onFilter: (filters: FilterOptions) => void;
  onViewChange: (view: 'grid' | 'map') => void;
  currentView: 'grid' | 'map';
}

export function PropertyFilterBar({ 
  onFilter, 
  onViewChange, 
  currentView = 'grid' 
}: PropertyFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 5000000],
    features: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const featureOptions = [
    { id: 'parking', label: 'Parking' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'garden', label: 'Garden' },
    { id: 'security', label: 'Security System' },
    { id: 'gym', label: 'Gym' },
    { id: 'balcony', label: 'Balcony' },
  ];

  const handleTypeChange = (value: string) => {
    setFilters({
      ...filters,
      type: value as PropertyType
    });
  };

  const handleBedroomChange = (value: string) => {
    setFilters({
      ...filters,
      bedrooms: value === 'any' ? undefined : parseInt(value)
    });
  };
  
  const handleBathroomChange = (value: string) => {
    setFilters({
      ...filters,
      bathrooms: value === 'any' ? undefined : parseInt(value)
    });
  };

  const handlePriceChange = (value: number[]) => {
    // Ensure we always have exactly two values for the price range
    const priceRange: [number, number] = [
      value[0] || 0,
      value[1] || 5000000
    ];
    
    setFilters({
      ...filters,
      priceRange
    });
  };

  const handleFeatureToggle = (id: string, checked: boolean) => {
    const currentFeatures = filters.features || [];
    
    setFilters({
      ...filters,
      features: checked 
        ? [...currentFeatures, id] 
        : currentFeatures.filter(f => f !== id)
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ...filters,
      search: searchQuery
    });
    
    // Apply filters
    onFilter({
      ...filters,
      search: searchQuery
    });
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    // Explicitly define as a tuple to match the expected type
    const defaultPriceRange: [number, number] = [0, 5000000];
    
    const clearedFilters: FilterOptions = {
      priceRange: defaultPriceRange,
      features: []
    };
    
    setFilters(clearedFilters);
    setSearchQuery('');
    onFilter(clearedFilters);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => {
                setSearchQuery('');
                setFilters({...filters, search: undefined});
                onFilter({...filters, search: undefined});
              }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </form>
        
        <div className="flex gap-2 ml-4">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[90vh] overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>Filter Properties</DrawerTitle>
                <DrawerDescription>
                  Adjust filters to find the perfect property
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="px-4 py-2">
                <div className="mb-6">
                  <Label className="mb-2 block">Property Type</Label>
                  <ToggleGroup type="single" variant="outline" className="justify-start">
                    <ToggleGroupItem value="residential" onClick={() => handleTypeChange('residential')}>
                      <Building2 className="h-4 w-4 mr-2" />
                      Residential
                    </ToggleGroupItem>
                    <ToggleGroupItem value="commercial" onClick={() => handleTypeChange('commercial')}>
                      <Store className="h-4 w-4 mr-2" />
                      Commercial
                    </ToggleGroupItem>
                    <ToggleGroupItem value="industrial" onClick={() => handleTypeChange('industrial')}>
                      <Factory className="h-4 w-4 mr-2" />
                      Industrial
                    </ToggleGroupItem>
                    <ToggleGroupItem value="land" onClick={() => handleTypeChange('land')}>
                      <Map className="h-4 w-4 mr-2" />
                      Land
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="mb-6">
                  <Label className="mb-2 block">Price Range</Label>
                  <div className="px-2">
                    <Slider 
                      defaultValue={[0, 5000000]} 
                      min={0} 
                      max={10000000} 
                      step={100000}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>RM {filters.priceRange?.[0].toLocaleString()}</span>
                      <span>RM {filters.priceRange?.[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="mb-2 block">Bedrooms</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filters.bedrooms || 'Any'}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-full">
                        <DropdownMenuItem onClick={() => handleBedroomChange('any')}>
                          Any
                        </DropdownMenuItem>
                        {[1, 2, 3, 4, 5].map(num => (
                          <DropdownMenuItem key={num} onClick={() => handleBedroomChange(num.toString())}>
                            {num}+
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Bathrooms</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filters.bathrooms || 'Any'}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-full">
                        <DropdownMenuItem onClick={() => handleBathroomChange('any')}>
                          Any
                        </DropdownMenuItem>
                        {[1, 2, 3, 4, 5].map(num => (
                          <DropdownMenuItem key={num} onClick={() => handleBathroomChange(num.toString())}>
                            {num}+
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label className="mb-2 block">Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {featureOptions.map(feature => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={feature.id} 
                          checked={filters.features?.includes(feature.id)}
                          onCheckedChange={(checked) => 
                            handleFeatureToggle(feature.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={feature.id} className="cursor-pointer">
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DrawerFooter>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          
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
              value="map" 
              onClick={() => onViewChange('map')}
              aria-label="Map view"
            >
              <Map className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
