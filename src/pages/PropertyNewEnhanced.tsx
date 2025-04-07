
import React from 'react';
import EnhancedPropertyForm from '@/components/property/EnhancedPropertyForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const PropertyNewEnhanced = () => {
  return (
    <div className="page-container-narrow">
      <div className="mb-6">
        <h1 className="page-title">Add New Property</h1>
        <p className="page-subtitle">
          Enter the property details step by step. Fields will adapt based on the property type.
        </p>
      </div>
      <ProtectedRoute>
        <EnhancedPropertyForm />
      </ProtectedRoute>
    </div>
  );
};

export default PropertyNewEnhanced;
