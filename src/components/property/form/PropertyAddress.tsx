
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const malaysiaStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Malacca',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu'
];

const PropertyAddress: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  const { address } = formData;

  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      address: {
        ...address,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="street">Street Address *</Label>
        <Input
          id="street"
          value={address?.street || ''}
          onChange={(e) => handleAddressChange('street', e.target.value)}
          placeholder="Enter street address"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={address?.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="Enter city"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Select
            value={address?.state || ''}
            onValueChange={(value) => handleAddressChange('state', value)}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {malaysiaStates.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zip">Postal Code</Label>
          <Input
            id="zip"
            value={address?.zip || ''}
            onChange={(e) => handleAddressChange('zip', e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={address?.country || 'Malaysia'}
            disabled
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyAddress;
