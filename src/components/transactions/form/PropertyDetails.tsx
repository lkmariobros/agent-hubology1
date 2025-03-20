
import React, { useState } from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type PropertyOption = {
  id: string;
  title: string;
  address: string;
  type: string;
  price?: number;
  rentalRate?: number;
};

// Sample property data - in a real app, this would come from an API
const sampleProperties: PropertyOption[] = [
  { id: 'prop1', title: 'Modern 3BR Condo', address: '123 Sky Tower, Downtown', type: 'Residential', price: 850000 },
  { id: 'prop2', title: 'Commercial Office Space', address: '456 Business Park', type: 'Commercial', price: 1200000 },
  { id: 'prop3', title: 'Luxury Villa with Pool', address: '789 Beachfront Drive', type: 'Residential', price: 2500000 },
];

const PropertyDetails: React.FC = () => {
  const { state, updateFormData } = useTransactionForm();
  const { formData, errors } = state;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PropertyOption[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // New property form state
  const [newProperty, setNewProperty] = useState({
    title: '',
    address: '',
    type: 'Residential',
    price: 0,
  });
  
  // Handle property search
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter properties based on search query
    const results = sampleProperties.filter(
      property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  // Handle property selection
  const selectProperty = (property: PropertyOption) => {
    updateFormData({ 
      propertyId: property.id,
      property: {
        id: property.id,
        title: property.title,
        address: property.address,
        type: property.type,
        price: property.price,
        rentalRate: property.rentalRate,
      },
      // Update transaction value based on property price if it exists
      ...(property.price && { transactionValue: property.price }),
    });
    
    setSearchResults([]);
    setSearchQuery('');
  };
  
  // Handle quick add property form
  const handleQuickAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };
  
  // Add new property
  const addNewProperty = () => {
    const newPropertyId = `new-${Date.now()}`;
    
    // Create new property object
    const propertyData = {
      id: newPropertyId,
      title: newProperty.title,
      address: newProperty.address,
      type: newProperty.type,
      price: newProperty.price,
    };
    
    // Update form data with new property
    updateFormData({
      propertyId: newPropertyId,
      property: propertyData,
      transactionValue: newProperty.price,
    });
    
    setShowQuickAdd(false);
    setNewProperty({ title: '', address: '', type: 'Residential', price: 0 });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Details</h2>
      
      {formData.property ? (
        // Show selected property
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{formData.property.title}</h3>
                <p className="text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {formData.property.address}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Type:</span> {formData.property.type}
                </p>
                <p className="mt-1">
                  <span className="font-medium">Price:</span> ${formData.property.price?.toLocaleString()}
                </p>
              </div>
              
              <Button variant="outline" onClick={() => updateFormData({ property: undefined, propertyId: undefined })}>
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Property selection interface
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a property..."
                className="pr-10"
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                aria-hidden="true"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowQuickAdd(!showQuickAdd);
                setSearchResults([]);
              }}
            >
              Quick Add
            </Button>
          </div>
          
          {errors.property && (
            <p className="text-sm text-destructive">{errors.property}</p>
          )}
          
          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-medium">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((property) => (
                  <Card key={property.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => selectProperty(property)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{property.title}</h4>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${property.price?.toLocaleString()}</p>
                          <p className="text-sm">{property.type}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Quick add property form */}
          {showQuickAdd && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Quick Add Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newProperty.title}
                      onChange={handleQuickAddChange}
                      placeholder="e.g. Modern 3BR Apartment"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={newProperty.address}
                      onChange={handleQuickAddChange}
                      placeholder="Full property address"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Property Type</Label>
                      <Input
                        id="type"
                        name="type"
                        value={newProperty.type}
                        onChange={handleQuickAddChange}
                        placeholder="e.g. Residential"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={newProperty.price || ''}
                        onChange={handleQuickAddChange}
                        placeholder="Property price"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowQuickAdd(false)}>Cancel</Button>
                <Button onClick={addNewProperty} disabled={!newProperty.title || !newProperty.address}>Add Property</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
