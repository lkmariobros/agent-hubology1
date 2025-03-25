
import React from 'react';
import PropertyForm from '@/components/property/PropertyForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const PropertyNew = () => {
  return (
    <div className="page-container-narrow">
      <div>
        <h1 className="page-title">Add New Property</h1>
        <p className="page-subtitle">
          Enter the essential details below to create a new property listing. You can always edit and add more information later.
        </p>
      </div>
      <ProtectedRoute>
        <PropertyForm />
      </ProtectedRoute>
    </div>
  );
};

export default PropertyNew;
