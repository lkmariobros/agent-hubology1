
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Building, Home } from 'lucide-react';
import { PropertyFormValues } from '@/types';
import { propertySubtypes } from './validation';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PropertyEssentialInfoProps {
  form: UseFormReturn<PropertyFormValues>;
  nextTab: () => void;
}

const PropertyEssentialInfo: React.FC<PropertyEssentialInfoProps> = ({ form, nextTab }) => {
  const propertyType = form.watch('propertyType');

  // Update when property type changes
  useEffect(() => {
    // Reset bedrooms and bathrooms when switching from/to residential
    if (propertyType !== 'residential') {
      form.setValue('bedrooms', undefined);
      form.setValue('bathrooms', undefined);
    } else {
      form.setValue('bedrooms', 0);
      form.setValue('bathrooms', 0);
    }
  }, [propertyType, form]);

  return (
    <div className="space-y-6">
      {/* Property Type Selection */}
      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Property Type *</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="residential" className="gap-2">
                  <Home className="h-4 w-4" />
                  Residential
                </ToggleGroupItem>
                <ToggleGroupItem value="commercial" className="gap-2">
                  <Building className="h-4 w-4" />
                  Commercial
                </ToggleGroupItem>
                <ToggleGroupItem value="industrial" className="gap-2">
                  <Building className="h-4 w-4" />
                  Industrial
                </ToggleGroupItem>
                <ToggleGroupItem value="land" className="gap-2">
                  <Building className="h-4 w-4" />
                  Land
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter property title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Subtype */}
        <div>
          <FormLabel>Property Subtype *</FormLabel>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={propertySubtypes[propertyType as keyof typeof propertySubtypes]?.[0] || ''}
            onChange={(e) => {
              // Handle subtype change without using form.setValue
              console.log("Selected subtype:", e.target.value);
            }}
          >
            {propertySubtypes[propertyType as keyof typeof propertySubtypes]?.map((subtype: string) => (
              <option key={subtype} value={subtype}>
                {subtype}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price *</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-7" 
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status *</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...field}
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end mt-6">
        <Button type="button" onClick={nextTab}>
          Continue to Details
        </Button>
      </div>
    </div>
  );
};

export default PropertyEssentialInfo;
