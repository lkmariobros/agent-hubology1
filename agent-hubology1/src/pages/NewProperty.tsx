
import React from 'react';
import ClerkPropertyFormWrapper from '@/components/property/ClerkPropertyFormWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const NewProperty = () => {
  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
          <CardDescription>Create a new property listing with detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <ClerkPropertyFormWrapper />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProperty;
