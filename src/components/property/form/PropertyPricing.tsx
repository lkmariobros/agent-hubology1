
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const PropertyPricing: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Property Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sale Price (shown for Sale transactions) */}
            {formData.transactionType === 'Sale' && (
              <div className="space-y-2">
                <Label htmlFor="price">Sale Price (RM)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => updateFormData({ price: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="Enter sale price"
                />
              </div>
            )}

            {/* Rental Rate (shown for Rent transactions) */}
            {formData.transactionType === 'Rent' && (
              <div className="space-y-2">
                <Label htmlFor="rentalRate">Rental Rate (RM/month)</Label>
                <Input
                  id="rentalRate"
                  type="number"
                  value={formData.rentalRate || ''}
                  onChange={(e) => 
                    updateFormData({ rentalRate: e.target.value ? parseFloat(e.target.value) : null })
                  }
                  placeholder="Enter monthly rental rate"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyPricing;
