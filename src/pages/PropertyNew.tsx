
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyForm from '@/components/property/PropertyForm';

const PropertyNew = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground">
            Enter the essential details below to create a new property listing. You can always edit and add more information later.
          </p>
        </div>
        <PropertyForm />
      </div>
    </MainLayout>
  );
};

export default PropertyNew;
