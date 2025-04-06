
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstLetter } from '@/utils/stringUtils';
import { AuthStateHandler } from '@/components/ui/auth-state-handler';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyService.getProperties(),
  });

  useEffect(() => {
    if (data) {
      const formattedProperties = data.map((property: any) => ({
        id: property.id,
        title: property.title,
        description: property.description,
        price: Number(property.price),
        type: property.type,
        subtype: property.subtype || 'standard',
        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        builtUpArea: Number(property.builtUpArea),
        status: property.status,
        address: {
          street: property.address.street,
          city: property.address.city,
          state: property.address.state,
          zip: property.address.zip,
          country: property.address.country,
        },
        area: property.area || '0',
        listedBy: property.listedBy || 'agency',
        features: property.features,
        images: property.images,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      }));
      setProperties(formattedProperties);
    }
  }, [data]);

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateProperty = () => {
    navigate('/properties/new');
  };

  return (
    <AuthStateHandler>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Properties</h1>
          <Button onClick={handleCreateProperty}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="search">Search Properties</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by title or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Property List</CardTitle>
            <CardDescription>
              {properties.length} properties listed
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500">Error: {(error as Error).message}</p>
            ) : (
              <Table>
                <TableCaption>A list of your properties.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Listed By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>${property.price}</TableCell>
                      <TableCell>{capitalizeFirstLetter(property.type)}</TableCell>
                      <TableCell>{property.address.city}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{property.status}</Badge>
                      </TableCell>
                      <TableCell>{property.listedBy}</TableCell>
                      <TableCell>{format(new Date(property.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link to={`/properties/${property.id}`}>View</Link>
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link to={`/properties/edit/${property.id}`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthStateHandler>
  );
};

export default Properties;
