
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PropertyTypeSelector from './PropertyTypeSelector';
import TransactionTypeToggle from './TransactionTypeToggle';

const PropertyBasicInfo: React.FC = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="Enter a compelling title for the property"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe the property in detail"
              className="min-h-32"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Property Type *</Label>
              <PropertyTypeSelector 
                value={formData.propertyType}
                onChange={(type) => updateFormData({ propertyType: type })}
              />
            </div>
            
            <div className="space-y-4">
              <Label>Transaction Type *</Label>
              <TransactionTypeToggle 
                value={formData.transactionType}
                onChange={(type) => updateFormData({ transactionType: type })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormData({ status: value as any })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select property status" />
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
            
            <div className="flex items-center space-x-2 h-full pt-8">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => updateFormData({ featured: checked })}
              />
              <Label htmlFor="featured">Featured Property</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyBasicInfo;
