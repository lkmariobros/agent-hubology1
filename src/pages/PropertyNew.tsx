
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyForm from '@/components/property/PropertyForm';

const PropertyNew = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
        <PropertyForm />
      </div>
    </MainLayout>
  );
};

export default PropertyNew;
