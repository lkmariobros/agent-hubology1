
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PropertyFilterBar from '@/components/property/PropertyFilterBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Properties = () => {
  const navigate = useNavigate();
  
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
        <PropertyFilterBar />
      </div>
    </MainLayout>
  );
};

export default Properties;
