
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PropertyFormSteps from './form/PropertyFormSteps';
import { propertySchema } from './form/validation';
import { PropertyFormValues } from '@/types';

const PropertyForm = () => {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      type: 'residential',
      subtype: 'Apartment',
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      features: [],
      status: 'available',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA'
      },
      images: []
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Property Listing</CardTitle>
        <CardDescription>
          Enter property information step by step - only essential fields are required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PropertyFormSteps form={form} />
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
