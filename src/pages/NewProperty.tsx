
import React from 'react';
import PropertyFormWrapper from '@/components/property/PropertyFormWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const NewProperty = () => {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Property</CardTitle>
            <CardDescription>Create a new property listing with detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyFormWrapper />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default NewProperty;
