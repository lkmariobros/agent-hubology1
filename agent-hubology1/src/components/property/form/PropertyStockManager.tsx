
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PropertyFormData } from '@/types/property-form';

interface PropertyStockManagerProps {
  form: UseFormReturn<PropertyFormData>;
}

export function PropertyStockManager({ form }: PropertyStockManagerProps) {
  // Get the current property type (to show this only for development properties)
  const transactionType = form.watch('transactionType');
  
  // Only show stock manager for new developments (Primary market properties)
  if (transactionType !== 'Primary') {
    return null;
  }

  // Initialize stock if it doesn't exist
  if (!form.getValues('stock')) {
    form.setValue('stock', {
      total: 0,
      available: 0,
      reserved: 0,
      sold: 0
    });
  }

  // Get the current values for validation
  const totalStock = form.watch('stock.total') || 0;
  const availableStock = form.watch('stock.available') || 0;
  const reservedStock = form.watch('stock.reserved') || 0;
  const soldStock = form.watch('stock.sold') || 0;
  
  // Calculate if there's a mismatch in stock numbers
  const calculatedTotal = availableStock + reservedStock + soldStock;
  const hasStockMismatch = totalStock > 0 && calculatedTotal !== totalStock;

  return (
    <Card className="border border-neutral-800 bg-neutral-900/50">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Stock Management</h3>
        
        {hasStockMismatch && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-500">Stock numbers don't add up:</p>
              <p className="text-xs text-neutral-400">
                Available ({availableStock}) + Reserved ({reservedStock}) + Sold ({soldStock}) = {calculatedTotal}, 
                but Total is set to {totalStock}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock.total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Units</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Total number of units" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Total number of units in this development</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stock.available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Units</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Number of available units" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Units currently available for sale</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stock.reserved"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reserved Units</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Number of reserved units" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Units currently reserved by clients</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stock.sold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sold Units</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Number of sold units" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Units already sold</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
