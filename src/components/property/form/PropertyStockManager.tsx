
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PropertyFormData } from '@/types/property-form';

interface PropertyStockManagerProps {
  form: UseFormReturn<any>; // Changed to 'any' to avoid typing issues
}

export function PropertyStockManager({ form }: PropertyStockManagerProps) {
  // Get the current property type (to show this only for development properties)
  const transactionType = form.watch('transactionType');
  
  // Only show stock manager for new developments (Primary market properties)
  if (transactionType !== 'Primary') {
    return null;
  }

  // Initialize stock if it doesn't exist
  const currentStock = form.getValues('stock');
  if (!currentStock) {
    form.setValue('stock', {
      total: 0,
      available: 0,
      reserved: 0,
      sold: 0
    });
  }

  // Get the current values for validation
  const totalStock = Number(form.watch('stock.total') || 0);
  const availableStock = Number(form.watch('stock.available') || 0);
  const reservedStock = Number(form.watch('stock.reserved') || 0);
  const soldStock = Number(form.watch('stock.sold') || 0);
  
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
          <div className="space-y-2">
            <label htmlFor="stock.total">Total Units</label>
            <input
              id="stock.total"
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Total number of units"
              {...form.register('stock.total', {
                valueAsNumber: true,
                onChange: (e) => form.setValue('stock.total', parseInt(e.target.value) || 0)
              })}
            />
            <p className="text-xs text-muted-foreground">Total number of units in this development</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="stock.available">Available Units</label>
            <input
              id="stock.available"
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Number of available units"
              {...form.register('stock.available', {
                valueAsNumber: true,
                onChange: (e) => form.setValue('stock.available', parseInt(e.target.value) || 0)
              })}
            />
            <p className="text-xs text-muted-foreground">Units currently available for sale</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="stock.reserved">Reserved Units</label>
            <input
              id="stock.reserved"
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Number of reserved units"
              {...form.register('stock.reserved', {
                valueAsNumber: true,
                onChange: (e) => form.setValue('stock.reserved', parseInt(e.target.value) || 0)
              })}
            />
            <p className="text-xs text-muted-foreground">Units currently reserved by clients</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="stock.sold">Sold Units</label>
            <input
              id="stock.sold"
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Number of sold units"
              {...form.register('stock.sold', {
                valueAsNumber: true,
                onChange: (e) => form.setValue('stock.sold', parseInt(e.target.value) || 0)
              })}
            />
            <p className="text-xs text-muted-foreground">Units already sold</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
