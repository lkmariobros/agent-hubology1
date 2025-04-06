
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const PropertyOwnerInfo: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { owner } = state.formData;

  const handleOwnerChange = (field: string, value: string | boolean) => {
    updateFormData({
      owner: {
        ...state.formData.owner,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Owner Information</CardTitle>
        <CardDescription>
          Add the property owner's contact details for your reference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              placeholder="Full name"
              value={owner?.name || ''}
              onChange={(e) => handleOwnerChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Phone Number</Label>
            <Input
              id="ownerPhone"
              placeholder="Contact number"
              value={owner?.phone || ''}
              onChange={(e) => handleOwnerChange('phone', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerEmail">Email Address</Label>
          <Input
            id="ownerEmail"
            type="email"
            placeholder="Email address"
            value={owner?.email || ''}
            onChange={(e) => handleOwnerChange('email', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerAddress">Address</Label>
          <Textarea
            id="ownerAddress"
            placeholder="Owner's address (if different from property)"
            value={owner?.address || ''}
            onChange={(e) => handleOwnerChange('address', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerNotes">Additional Notes</Label>
          <Textarea
            id="ownerNotes"
            placeholder="Any additional information about the owner"
            value={owner?.notes || ''}
            onChange={(e) => handleOwnerChange('notes', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="is_primary_contact"
            checked={owner?.isPrimaryContact || false}
            onCheckedChange={(checked) => 
              handleOwnerChange('isPrimaryContact', Boolean(checked))
            }
          />
          <Label htmlFor="is_primary_contact" className="text-sm font-normal">
            Owner is the primary contact for this property
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOwnerInfo;
