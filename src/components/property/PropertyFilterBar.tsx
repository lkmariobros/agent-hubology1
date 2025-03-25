
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PropertyFilters } from '@/hooks/useProperties';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyFilterBarProps {
  filters: PropertyFilters;
  updateFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  totalCount?: number;
  loading?: boolean;
}

const PropertyFilterBar: React.FC<PropertyFilterBarProps> = ({
  filters,
  updateFilters,
  resetFilters,
  totalCount,
  loading
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [bedroomsValue, setBedroomsValue] = useState<number | null>(null);
  const [bathroomsValue, setBathroomsValue] = useState<number | null>(null);
  const [propertyTypeValue, setPropertyTypeValue] = useState<string | null>(null);
  
  const toggleFilterExpand = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    updateFilters({ 
      searchQuery: searchValue,
      title: searchValue 
    });
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    updateFilters({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };
  
  const handleBedroomsChange = (value: string | null) => {
    const numValue = value ? parseInt(value, 10) : null;
    setBedroomsValue(numValue);
    if (numValue !== null) {
      updateFilters({ 
        minBedrooms: numValue,
        bedrooms: numValue
      });
    } else {
      // Remove the filter if null
      const { minBedrooms, bedrooms, ...rest } = filters;
      updateFilters(rest);
    }
  };
  
  const handleBathroomsChange = (value: string | null) => {
    const numValue = value ? parseInt(value, 10) : null;
    setBathroomsValue(numValue);
    if (numValue !== null) {
      updateFilters({ 
        minBathrooms: numValue,
        bathrooms: numValue
      });
    } else {
      // Remove the filter if null
      const { minBathrooms, bathrooms, ...rest } = filters;
      updateFilters(rest);
    }
  };
  
  const handlePropertyTypeChange = (value: string | null) => {
    setPropertyTypeValue(value);
    if (value) {
      updateFilters({ 
        type: value,
        propertyType: value
      });
    } else {
      // Remove the filter if null
      const { type, propertyType, ...rest } = filters;
      updateFilters(rest);
    }
  };
  
  const handleReset = () => {
    resetFilters();
    setPriceRange([0, 5000000]);
    setBedroomsValue(null);
    setBathroomsValue(null);
    setPropertyTypeValue(null);
  };

  const hasActiveFilters = () => {
    return (
      !!filters.searchQuery ||
      !!filters.title ||
      !!filters.minPrice ||
      !!filters.maxPrice ||
      !!filters.minBedrooms ||
      !!filters.bedrooms ||
      !!filters.minBathrooms ||
      !!filters.bathrooms ||
      !!filters.type ||
      !!filters.propertyType
    );
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Search bar and filter toggle */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-9"
                value={filters.searchQuery || filters.title || ''}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              variant={isFilterExpanded ? "default" : "outline"} 
              onClick={toggleFilterExpand}
              className="flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="flex items-center"
              >
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
          
          {/* Filter badges/chips */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2">
              {(filters.searchQuery || filters.title) && (
                <Badge variant="secondary" className="flex items-center">
                  Search: {filters.searchQuery || filters.title}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ searchQuery: '', title: '' })}
                  />
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="secondary" className="flex items-center">
                  Price: ${filters.minPrice?.toLocaleString()} - ${filters.maxPrice?.toLocaleString()}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilters({ minPrice: undefined, maxPrice: undefined });
                      setPriceRange([0, 5000000]);
                    }}
                  />
                </Badge>
              )}
              {(filters.minBedrooms || filters.bedrooms) && (
                <Badge variant="secondary" className="flex items-center">
                  Bedrooms: {filters.minBedrooms || filters.bedrooms}+
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilters({ minBedrooms: undefined, bedrooms: undefined });
                      setBedroomsValue(null);
                    }}
                  />
                </Badge>
              )}
              {(filters.minBathrooms || filters.bathrooms) && (
                <Badge variant="secondary" className="flex items-center">
                  Bathrooms: {filters.minBathrooms || filters.bathrooms}+
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilters({ minBathrooms: undefined, bathrooms: undefined });
                      setBathroomsValue(null);
                    }}
                  />
                </Badge>
              )}
              {(filters.type || filters.propertyType) && (
                <Badge variant="secondary" className="flex items-center">
                  Type: {filters.type || filters.propertyType}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilters({ type: undefined, propertyType: undefined });
                      setPropertyTypeValue(null);
                    }}
                  />
                </Badge>
              )}
            </div>
          )}
          
          {/* Expanded filter options */}
          {isFilterExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Property Type</h3>
                <Select 
                  value={propertyTypeValue || undefined} 
                  onValueChange={handlePropertyTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="mb-2 text-sm font-medium">Bedrooms</h3>
                <Select 
                  value={bedroomsValue?.toString() || undefined} 
                  onValueChange={handleBedroomsChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="mb-2 text-sm font-medium">Bathrooms</h3>
                <Select 
                  value={bathroomsValue?.toString() || undefined} 
                  onValueChange={handleBathroomsChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="mb-2 text-sm font-medium">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 5000000]}
                    value={priceRange}
                    min={0}
                    max={10000000}
                    step={50000}
                    onValueChange={handlePriceChange}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>${priceRange[0].toLocaleString()}</div>
                    <div>${priceRange[1].toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Results count */}
          {totalCount !== undefined && !loading && (
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-muted-foreground">
                {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFilterBar;
