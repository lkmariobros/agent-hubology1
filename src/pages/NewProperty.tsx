
import React from 'react';
import EnhancedPropertyForm from '@/components/property/EnhancedPropertyForm';

const NewProperty = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Property</h1>
      <EnhancedPropertyForm />
    </div>
  );
};

export default NewProperty;
