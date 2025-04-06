
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AddressTab: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;

  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      address: {
        ...formData.address,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={formData.address.street}
          onChange={(e) => handleAddressChange('street', e.target.value)}
          placeholder="Enter street address"
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="Enter city"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.address.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            placeholder="Enter state"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zip">Postal/Zip Code</Label>
          <Input
            id="zip"
            value={formData.address.zip}
            onChange={(e) => handleAddressChange('zip', e.target.value)}
            placeholder="Enter postal/zip code"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Select
            value={formData.address.country}
            onValueChange={(value) => handleAddressChange('country', value)}
          >
            <SelectTrigger id="country" className="mt-1">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Malaysia">Malaysia</SelectItem>
              <SelectItem value="Singapore">Singapore</SelectItem>
              <SelectItem value="Indonesia">Indonesia</SelectItem>
              <SelectItem value="Thailand">Thailand</SelectItem>
              <SelectItem value="Vietnam">Vietnam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AddressTab;
