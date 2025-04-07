
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SaveIcon } from 'lucide-react';

const DefaultPropertyValues = () => {
  const [defaultValues, setDefaultValues] = useState({
    propertyType: 'residential',
    transactionType: 'sale',
    status: 'available',
    country: 'Malaysia',
    state: 'Kuala Lumpur',
    currency: 'MYR',
    agencyFee: '2.0'
  });

  const handleInputChange = (field: string, value: string) => {
    setDefaultValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveDefaults = () => {
    // In a real implementation, this would save to backend
    console.log('Saving default values:', defaultValues);
    toast.success('Default property values saved successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Property Values</CardTitle>
        <CardDescription>
          Set default values for new property listings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Default Property Type</Label>
            <Select 
              value={defaultValues.propertyType}
              onValueChange={(value) => handleInputChange('propertyType', value)}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transactionType">Default Transaction Type</Label>
            <Select 
              value={defaultValues.transactionType}
              onValueChange={(value) => handleInputChange('transactionType', value)}
            >
              <SelectTrigger id="transactionType">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="primary">Primary (Developer)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Default Property Status</Label>
            <Select 
              value={defaultValues.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="leased">Leased</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select 
              value={defaultValues.currency}
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Default Country</Label>
            <Input
              id="country"
              value={defaultValues.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">Default State</Label>
            <Input
              id="state"
              value={defaultValues.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agencyFee">Default Agency Fee (%)</Label>
            <Input
              id="agencyFee"
              value={defaultValues.agencyFee}
              onChange={(e) => handleInputChange('agencyFee', e.target.value)}
              type="number"
              step="0.1"
              min="0"
              max="10"
            />
          </div>
        </div>
        
        <Button className="w-full mt-6" onClick={saveDefaults}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Default Values
        </Button>
      </CardContent>
    </Card>
  );
};

export default DefaultPropertyValues;
