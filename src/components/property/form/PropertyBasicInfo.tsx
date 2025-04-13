
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PropertyBasicInfo: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  const { transactionType } = formData;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Basic Information</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="Enter a descriptive title for your property"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe the property in detail"
            className="min-h-32"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactionType === 'Sale' && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => updateFormData({ price: e.target.value ? Number(e.target.value) : null })}
                placeholder="Enter sale price"
              />
            </div>
          )}

          {transactionType === 'Rent' && (
            <div className="space-y-2">
              <Label htmlFor="rentalRate">Rental Rate (RM)</Label>
              <Input
                id="rentalRate"
                type="number"
                value={formData.rentalRate || ''}
                onChange={(e) => updateFormData({ rentalRate: e.target.value ? Number(e.target.value) : null })}
                placeholder="Enter monthly rental rate"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateFormData({ status: value as any })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Under Offer">Under Offer</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
                <SelectItem value="Rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => updateFormData({ featured: checked })}
          />
          <Label htmlFor="featured">Feature this listing (premium visibility)</Label>
        </div>
      </div>
    </div>
  );
};

export default PropertyBasicInfo;
