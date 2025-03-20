
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import PropertyFormSteps from './form/PropertyFormSteps';

const PropertyForm = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Property Listing</CardTitle>
        <CardDescription>
          Enter property information step by step - only essential fields are required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form>
          <PropertyFormSteps />
        </Form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
