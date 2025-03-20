
import React, { useState } from 'react';
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

type ViewMode = 'list' | 'grid' | 'map';

const Properties = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Default to grid view
  const [properties] = useState<Property[]>(sampleProperties);
  
  const handleViewChange = (newView: 'grid' | 'map') => {
    // Convert the incoming view type to our internal ViewMode
    const mode: ViewMode = newView === 'grid' ? 'list' : 'map';
    setViewMode(mode);
  };
  
  const handleFilter = (filters: any) => {
    console.log('Applying filters:', filters);
    // Implementation for filtering properties would go here
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-normal tracking-tight">Properties</h1>
          <Button 
            size="sm"
            className="gap-2" 
            onClick={() => navigate('/properties/new')}
          >
            <Plus size={16} />
            Add Property
          </Button>
        </div>
        
        <PropertyFilterBar 
          onFilter={handleFilter} 
          onViewChange={handleViewChange} 
          currentView={viewMode === 'list' ? 'grid' : 'map'}
        />
        
        {viewMode === 'list' && (
          <Card className="overflow-hidden">
            <PropertyTable properties={properties} />
          </Card>
        )}
        {viewMode === 'grid' && <PropertyGrid properties={properties} />}
        {viewMode === 'map' && (
          <Card className="overflow-hidden">
            <PropertyMap properties={properties} />
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Properties;
