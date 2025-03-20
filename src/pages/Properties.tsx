import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PropertyFilterBar } from '@/components/property/PropertyFilterBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Property } from '@/types';
import { PropertyTable } from '@/components/property/PropertyTable';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyMap } from '@/components/property/PropertyMap';
import { sampleProperties } from '@/data/sampleProperties';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Import ViewMode type from PropertyFilterBar
import { ViewMode } from '@/components/property/PropertyFilterBar';
import { PropertyFilterDrawer, FilterOptions } from '@/components/property/filters/PropertyFilterDrawer';
import { SlidersHorizontal } from 'lucide-react';

type TimeFilter = '7days' | '30days' | '90days' | 'all';

const Properties = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 5000000],
    features: []
  });
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    value: 0,
    change: {
      total: 0,
      active: 0
    }
  });

  useEffect(() => {
    // Calculate summary statistics
    const total = properties.length;
    const active = properties.filter(p => p.status === 'available').length;
    const pending = properties.filter(p => p.status === 'pending').length;
    const value = properties.reduce((sum, p) => sum + p.price, 0);

    // Simulate weekly changes (in a real app, this would come from API)
    const change = {
      total: Math.floor(Math.random() * 10) + 1,
      // +1 to +10
      active: Math.round(Math.random() * 6 - 3) // -3% to +3%
    };
    setSummaryStats({
      total,
      active,
      pending,
      value,
      change
    });
  }, [properties]);

  // Filter properties based on time
  useEffect(() => {
    if (timeFilter === 'all') {
      setFilteredProperties(properties);
      return;
    }
    const now = new Date();
    let daysAgo;
    switch (timeFilter) {
      case '7days':
        daysAgo = 7;
        break;
      case '30days':
        daysAgo = 30;
        break;
      case '90days':
        daysAgo = 90;
        break;
      default:
        daysAgo = 0;
    }
    const filterDate = new Date();
    filterDate.setDate(now.getDate() - daysAgo);
    const filtered = properties.filter(property => {
      const createdDate = new Date(property.createdAt);
      return createdDate >= filterDate;
    });
    setFilteredProperties(filtered);
  }, [timeFilter, properties]);
  
  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };
  
  const handleFilter = (newFilters: FilterOptions) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    // In a real app, this would filter the properties based on the filters
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    // Implementation for filtering properties would go here
  };

  const handleClearFilters = () => {
    const defaultPriceRange: [number, number] = [0, 5000000];
    setFilters({
      priceRange: defaultPriceRange,
      features: []
    });
  };
  
  return (
    <MainLayout>
      <div className="page-container">
        {/* Header section with consistent alignment */}
        <div className="page-header">
          <h1 className="page-title">Properties</h1>
          <Button 
            size="sm" 
            className="gap-2 rounded-full px-6 bg-orange-500 hover:bg-orange-600" 
            onClick={() => navigate('/properties/new')}
          >
            <Plus size={16} />
            Add Property
          </Button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 bg-neutral-900/60 backdrop-blur-sm rounded-lg p-5">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Total Properties</span>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-medium">{summaryStats.total}</span>
              <span className="ml-2 text-xs text-emerald-500">+{summaryStats.change.total} this week</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Active Listings</span>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-medium">{summaryStats.active}</span>
              <span className={`ml-2 text-xs ${summaryStats.change.active >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {summaryStats.change.active >= 0 ? '+' : ''}{summaryStats.change.active}% of total
              </span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Pending Approvals</span>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-medium">{summaryStats.pending}</span>
              <span className="ml-2 text-xs text-neutral-400">properties</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Total Value</span>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-medium">${(summaryStats.value / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </div>
        
        {/* Filter row with consistent alignment */}
        <div className="flex justify-between bg-neutral-900 rounded-lg p-4">
          <div className="flex-1">
            <PropertyFilterBar 
              onFilter={handleFilter} 
              onViewChange={handleViewChange} 
              currentView={viewMode} 
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeFilter} onValueChange={value => setTimeFilter(value as TimeFilter)}>
              <SelectTrigger className="w-[130px] h-10 rounded-lg bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="newest">
              <SelectTrigger className="w-[130px] h-10 rounded-lg bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter button now located on the far right */}
            <PropertyFilterDrawer 
              filters={filters}
              onFiltersChange={setFilters}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal size={16} />
                  Filters
                </Button>
              }
            />
          </div>
        </div>
        
        {/* Property content - removed the background/border */}
        <div className="min-h-[60vh] relative">
          {viewMode === 'grid' && <PropertyGrid properties={filteredProperties} />}
          {viewMode === 'table' && <PropertyTable properties={filteredProperties} />}
          {viewMode === 'map' && <PropertyMap properties={filteredProperties} />}
        </div>
      </div>
    </MainLayout>
  );
};

export default Properties;
