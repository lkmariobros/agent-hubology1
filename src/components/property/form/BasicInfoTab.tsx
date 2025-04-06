
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const BasicInfoTab: React.FC = () => {
  const { state, updateFormData, updatePropertyType, updateTransactionType } = usePropertyForm();
  const { formData } = state;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Property Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Enter property title"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <Select
          value={formData.propertyType}
          onValueChange={(value: 'Residential' | 'Commercial' | 'Industrial' | 'Land') => 
            updatePropertyType(value)
          }
        >
          <SelectTrigger id="propertyType" className="mt-1">
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Industrial">Industrial</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="transactionType">Transaction Type</Label>
        <Select
          value={formData.transactionType}
          onValueChange={(value: 'Sale' | 'Rent' | 'Primary') => 
            updateTransactionType(value)
          }
        >
          <SelectTrigger id="transactionType" className="mt-1">
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sale">Sale</SelectItem>
            <SelectItem value="Rent">Rent</SelectItem>
            <SelectItem value="Primary">Primary (Developer)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => updateFormData({ status: value })}
        >
          <SelectTrigger id="status" className="mt-1">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Under Contract">Under Contract</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
            <SelectItem value="Off Market">Off Market</SelectItem>
            <SelectItem value="Coming Soon">Coming Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Enter property description"
          className="mt-1 min-h-[150px]"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="featured" className="cursor-pointer">Featured Property</Label>
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => updateFormData({ featured: checked })}
        />
      </div>
      
      <div>
        <Label htmlFor="price">Price (if for sale)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price || ''}
          onChange={(e) => updateFormData({ price: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Enter property price"
          className="mt-1"
          disabled={formData.transactionType === 'Rent'}
        />
      </div>
      
      <div>
        <Label htmlFor="rentalRate">Rental Rate (if for rent)</Label>
        <Input
          id="rentalRate"
          type="number"
          value={formData.rentalRate || ''}
          onChange={(e) => updateFormData({ rentalRate: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Enter rental rate"
          className="mt-1"
          disabled={formData.transactionType === 'Sale' || formData.transactionType === 'Primary'}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
