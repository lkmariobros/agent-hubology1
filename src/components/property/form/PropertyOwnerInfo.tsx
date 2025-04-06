
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const PropertyOwnerInfo: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  const owner = formData.owner || {
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    company: '',
    isPrimaryContact: true
  };

  const handleChange = (field: string, value: any) => {
    updateFormData({
      owner: {
        ...owner,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="ownerName">Owner Name</Label>
        <Input
          id="ownerName"
          value={owner.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter owner's name"
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ownerEmail">Email</Label>
          <Input
            id="ownerEmail"
            type="email"
            value={owner.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter owner's email"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="ownerPhone">Phone</Label>
          <Input
            id="ownerPhone"
            value={owner.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter owner's phone"
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="ownerCompany">Company (if applicable)</Label>
        <Input
          id="ownerCompany"
          value={owner.company || ''}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Enter owner's company"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="ownerAddress">Address</Label>
        <Textarea
          id="ownerAddress"
          value={owner.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Enter owner's address"
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="ownerNotes">Notes</Label>
        <Textarea
          id="ownerNotes"
          value={owner.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Enter any additional notes about the owner"
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPrimaryContact"
          checked={owner.isPrimaryContact}
          onCheckedChange={(checked) => handleChange('isPrimaryContact', !!checked)}
        />
        <label
          htmlFor="isPrimaryContact"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Primary Contact
        </label>
      </div>
    </div>
  );
};

export default PropertyOwnerInfo;
