
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PropertyAddress: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { address } = state.formData;

  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      address: {
        ...address,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Address</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            placeholder="Enter street address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="Enter state"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">Postal/ZIP Code</Label>
            <Input
              id="zip"
              value={address.zip}
              onChange={(e) => handleAddressChange('zip', e.target.value)}
              placeholder="Enter postal code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="Enter country"
              defaultValue="Malaysia"
            />
          </div>
        </div>

        {/* Map integration placeholder - to be implemented */}
        <div className="mt-4 border border-dashed rounded-md p-8 flex flex-col items-center justify-center bg-muted/30">
          <p className="text-muted-foreground text-center">
            Map integration will be added here
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyAddress;
