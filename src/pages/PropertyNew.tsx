
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyForm from '@/components/property/PropertyForm';

const PropertyNew = () => {
  return (
    <MainLayout>
      <div className="page-container-narrow">
        <div>
          <h1 className="page-title">Add New Property</h1>
          <p className="page-subtitle">
            Enter the essential details below to create a new property listing. You can always edit and add more information later.
          </p>
        </div>
        <PropertyForm />
      </div>
    </MainLayout>
  );
};

export default PropertyNew;
