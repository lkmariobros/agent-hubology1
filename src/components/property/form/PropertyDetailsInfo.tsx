
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from '@/types';
import { getFeaturesByType } from './validation';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface PropertyDetailsInfoProps {
  form: UseFormReturn<PropertyFormValues>;
  nextTab: () => void;
  prevTab: () => void;
}

const PropertyDetailsInfo: React.FC<PropertyDetailsInfoProps> = ({ form, nextTab, prevTab }) => {
  const propertyType = form.watch('type');

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the property..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area (sq ft) *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields for residential properties */}
        {propertyType === 'residential' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Features - moved to a collapsible section */}
      <div className="border rounded-md p-4">
        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Features (Optional)</FormLabel>
                <FormDescription>
                  Select features available for this property.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getFeaturesByType(propertyType).slice(0, 6).map((feature) => (
                  <FormField
                    key={feature.id}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={feature.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(feature.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = [...field.value];
                                if (checked) {
                                  field.onChange([...currentValues, feature.id]);
                                } else {
                                  field.onChange(
                                    currentValues.filter((value) => value !== feature.id)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {feature.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={prevTab}>
          Back
        </Button>
        <Button type="button" onClick={nextTab}>
          Continue to Address
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetailsInfo;
