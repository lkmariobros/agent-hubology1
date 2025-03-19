
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Building, Home, Upload, Plus, X, Check } from 'lucide-react';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PropertyFormValues } from '@/types';

// Common features for different property types
const commonFeatures = [
  { id: 'parking', label: 'Parking' },
  { id: 'security', label: 'Security System' },
  { id: 'aircon', label: 'Air Conditioning' },
];

const residentialFeatures = [
  { id: 'furnished', label: 'Furnished' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'garden', label: 'Garden' },
];

const commercialFeatures = [
  { id: 'reception', label: 'Reception Area' },
  { id: 'conferenceRoom', label: 'Conference Room' },
  { id: 'kitchenette', label: 'Kitchenette' },
];

const industrialFeatures = [
  { id: 'loading', label: 'Loading Dock' },
  { id: 'highCeiling', label: 'High Ceiling' },
  { id: 'heavyPower', label: 'Heavy Power Supply' },
];

const landFeatures = [
  { id: 'waterAccess', label: 'Water Access' },
  { id: 'roadFrontage', label: 'Road Frontage' },
  { id: 'cleared', label: 'Cleared Land' },
];

// Subtypes for each property type
const propertySubtypes = {
  residential: ['Apartment', 'House', 'Townhouse', 'Condominium', 'Villa'],
  commercial: ['Office', 'Retail', 'Restaurant', 'Hotel', 'Mixed Use'],
  industrial: ['Warehouse', 'Factory', 'Workshop', 'Distribution Center'],
  land: ['Residential Land', 'Commercial Land', 'Agricultural Land', 'Industrial Land'],
};

// Validation schema - simplified for essential fields
const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  type: z.enum(['residential', 'commercial', 'industrial', 'land']),
  subtype: z.string().min(1, 'Subtype is required'),
  area: z.coerce.number().min(1, 'Area must be greater than 0'),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  features: z.array(z.string()).default([]),
  status: z.enum(['available', 'pending', 'sold']).default('available'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP/Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

const PropertyForm = () => {
  const navigate = useNavigate();
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("essential");

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      type: 'residential',
      subtype: propertySubtypes.residential[0],
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      features: [],
      status: 'available',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA'
      },
      images: []
    },
  });

  const propertyType = form.watch('type');

  const getFeaturesByType = () => {
    switch (propertyType) {
      case 'residential':
        return [...commonFeatures, ...residentialFeatures];
      case 'commercial':
        return [...commonFeatures, ...commercialFeatures];
      case 'industrial':
        return [...commonFeatures, ...industrialFeatures];
      case 'land':
        return landFeatures;
      default:
        return commonFeatures;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPropertyImages([...propertyImages, ...newFiles]);
      toast.success(`${newFiles.length} image(s) added`);
    }
  };

  const removeImage = (index: number) => {
    setPropertyImages(propertyImages.filter((_, i) => i !== index));
    toast.info('Image removed');
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add the files to form data
      const formData = {
        ...data,
        images: propertyImages,
      };
      
      console.log('Property submitted:', formData);
      
      // Here you would normally send the data to your API
      // For now, we'll just simulate a successful submission
      toast.success('Property created successfully!');
      setTimeout(() => {
        navigate('/properties');
      }, 1500);
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update subtype when property type changes
  React.useEffect(() => {
    form.setValue('subtype', propertySubtypes[propertyType][0]);
    // Reset bedrooms and bathrooms when switching from/to residential
    if (propertyType !== 'residential') {
      form.setValue('bedrooms', undefined);
      form.setValue('bathrooms', undefined);
    } else {
      form.setValue('bedrooms', 0);
      form.setValue('bathrooms', 0);
    }
  }, [propertyType, form]);

  const nextTab = () => {
    if (activeTab === "essential") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("address");
    else if (activeTab === "address") setActiveTab("media");
  };

  const prevTab = () => {
    if (activeTab === "media") setActiveTab("address");
    else if (activeTab === "address") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("essential");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Property Listing</CardTitle>
        <CardDescription>
          Enter property information step by step - only essential fields are required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="text-sm">Essential Info</div>
                <div className="text-sm">Property Details</div>
                <div className="text-sm">Address</div>
                <div className="text-sm">Media</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: activeTab === "essential" ? "25%" : 
                           activeTab === "details" ? "50%" : 
                           activeTab === "address" ? "75%" : "100%" 
                  }}
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* STEP 1: Essential Information */}
              <TabsContent value="essential" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {/* Property Type Selection */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Property Type *</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            value={field.value}
                            onValueChange={(value) => {
                              if (value) field.onChange(value);
                            }}
                            className="justify-start flex-wrap"
                          >
                            <ToggleGroupItem value="residential" className="gap-2">
                              <Home className="h-4 w-4" />
                              Residential
                            </ToggleGroupItem>
                            <ToggleGroupItem value="commercial" className="gap-2">
                              <Building className="h-4 w-4" />
                              Commercial
                            </ToggleGroupItem>
                            <ToggleGroupItem value="industrial" className="gap-2">
                              <Building className="h-4 w-4" />
                              Industrial
                            </ToggleGroupItem>
                            <ToggleGroupItem value="land" className="gap-2">
                              <Building className="h-4 w-4" />
                              Land
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter property title..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subtype"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Subtype *</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              {propertySubtypes[propertyType].map((subtype) => (
                                <option key={subtype} value={subtype}>
                                  {subtype}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-7" 
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="button" onClick={nextTab}>
                    Continue to Details
                  </Button>
                </div>
              </TabsContent>

              {/* STEP 2: Property Details */}
              <TabsContent value="details" className="space-y-6 mt-0">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the property..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (sq ft) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional fields for residential properties */}
                  {propertyType === 'residential' && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Features - moved to a collapsible section */}
                <div className="border rounded-md p-4">
                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel className="text-base">Features (Optional)</FormLabel>
                          <FormDescription>
                            Select features available for this property.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {getFeaturesByType().slice(0, 6).map((feature) => (
                            <FormField
                              key={feature.id}
                              control={form.control}
                              name="features"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={feature.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(feature.id)}
                                        onCheckedChange={(checked) => {
                                          const currentValues = [...field.value];
                                          if (checked) {
                                            field.onChange([...currentValues, feature.id]);
                                          } else {
                                            field.onChange(
                                              currentValues.filter((value) => value !== feature.id)
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {feature.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextTab}>
                    Continue to Address
                  </Button>
                </div>
              </TabsContent>

              {/* STEP 3: Address */}
              <TabsContent value="address" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province *</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <Input placeholder="USA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextTab}>
                    Continue to Media
                  </Button>
                </div>
              </TabsContent>

              {/* STEP 4: Media Upload */}
              <TabsContent value="media" className="space-y-6 mt-0">
                <div className="space-y-3">
                  <FormLabel>Property Images (Optional)</FormLabel>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">Drag and drop images or click to upload</p>
                    <label htmlFor="image-upload">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button type="button" variant="outline" className="cursor-pointer">
                        Select Images
                      </Button>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {propertyImages.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-sm font-medium">Uploaded Images:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {propertyImages.map((image, index) => (
                          <div 
                            key={index} 
                            className="relative rounded-md overflow-hidden aspect-square border"
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Property ${index}`}
                              className="object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Submit Buttons */}
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Back
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/properties')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Create Property'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
