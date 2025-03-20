import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PropertyFilterBar } from '@/components/property/PropertyFilterBar';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Property } from '@/types';
import { PropertyTable } from '@/components/property/PropertyTable';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyMap } from '@/components/property/PropertyMap';
import { sampleProperties } from '@/data/sampleProperties';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
type ViewMode = 'grid' | 'table' | 'map';
type TimeFilter = '7days' | '30days' | '90days' | 'all';
const Properties = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
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
  const handleFilter = (filters: any) => {
    console.log('Applying filters:', filters);
    // Implementation for filtering properties would go here
  };
  return <MainLayout>
      <div className="p-6 space-y-6 max-w-[1560px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-normal tracking-tight">Properties</h1>
          <Button size="sm" className="gap-2 rounded-full bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/properties/new')}>
            <Plus size={16} />
            Add Property
          </Button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-0 bg-neutral-950/40 backdrop-blur-sm">
            <div className="text-sm text-neutral-400">Total Properties</div>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-mono text-white">{summaryStats.total}</span>
              <span className="ml-2 text-xs text-emerald-500">+{summaryStats.change.total} this week</span>
            </div>
          </Card>
          
          <Card className="p-4 border-0 bg-neutral-950/40 backdrop-blur-sm">
            <div className="text-sm text-neutral-400">Active Listings</div>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-mono text-white">{summaryStats.active}</span>
              <span className={`ml-2 text-xs ${summaryStats.change.active >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {summaryStats.change.active >= 0 ? '+' : ''}{summaryStats.change.active}% of total
              </span>
            </div>
          </Card>
          
          <Card className="p-4 border-0 bg-neutral-950/40 backdrop-blur-sm">
            <div className="text-sm text-neutral-400">Pending Approvals</div>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-mono text-white">{summaryStats.pending}</span>
              <span className="ml-2 text-xs text-neutral-400">properties</span>
            </div>
          </Card>
          
          <Card className="p-4 border-0 bg-neutral-950/40 backdrop-blur-sm">
            <div className="text-sm text-neutral-400">Total Value</div>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-mono text-white">${(summaryStats.value / 1000000).toFixed(2)}M</span>
            </div>
          </Card>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <PropertyFilterBar onFilter={handleFilter} onViewChange={handleViewChange} currentView={viewMode} />
          
          <div className="ml-auto flex gap-2 items-center">
            <Select value={timeFilter} onValueChange={value => setTimeFilter(value as TimeFilter)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <ToggleGroup type="single" value={viewMode} className="mr-2">
              
              <ToggleGroupItem value="table" onClick={() => handleViewChange('table')} aria-label="Table view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        <div className="bg-neutral-950/30 backdrop-blur-sm rounded-xl p-1 min-h-[60vh] relative">
          {viewMode === 'grid' && <PropertyGrid properties={filteredProperties} />}
          {viewMode === 'table' && <PropertyTable properties={filteredProperties} />}
          {viewMode === 'map' && <Card className="overflow-hidden border-0 bg-transparent">
              <PropertyMap properties={filteredProperties} />
            </Card>}
        </div>
      </div>
    </MainLayout>;
};
export default Properties;