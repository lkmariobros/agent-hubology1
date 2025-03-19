
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyForm from '@/components/property/PropertyForm';

const PropertyNew = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl font-normal tracking-tight">Add New Property</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the essential details below to create a new property listing. You can always edit and add more information later.
          </p>
        </div>
        <PropertyForm />
      </div>
    </MainLayout>
  );
};

export default PropertyNew;
