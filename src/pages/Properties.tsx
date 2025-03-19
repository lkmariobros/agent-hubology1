
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PropertyFilterBar } from '@/components/property/PropertyFilterBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Properties = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'map'>('grid');
  
  const handleViewChange = (newView: 'grid' | 'map') => {
    setView(newView);
  };
  
  const handleFilter = (filters: any) => {
    console.log('Applying filters:', filters);
    // Implementation for filtering properties would go here
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <Button 
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
          currentView={view}
        />
        
        {/* Property list would be rendered here */}
        <div className="mt-8">
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <p className="col-span-full text-center text-muted-foreground py-12">
                No properties to display. Add a new property to get started.
              </p>
            </div>
          ) : (
            <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Map view is currently under development
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Properties;
