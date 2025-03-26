import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Download, Plus, ArrowUpDown } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(0);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [propertyType, setPropertyType] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const { usePropertiesQuery } = useProperties();
  const { data, isLoading, isError } = usePropertiesQuery({
    search: searchQuery,
    limit: 12,
    page: currentPage,
    minPrice: minPrice,
    maxPrice: maxPrice,
    type: propertyType,
    status: statusFilter,
    featured: isFeatured
  });

  const properties = data?.properties || [];
  const totalProperties = data?.total || 0;
  const totalPages = Math.ceil(totalProperties / 12);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  }, [searchQuery, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleFiltersApply = () => {
    setCurrentPage(0);
    setIsFilterDialogOpen(false);
  };

  const handleFiltersReset = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPropertyType(undefined);
    setStatusFilter(undefined);
    setIsFeatured(false);
    setCurrentPage(0);
  };

  // Function to determine which badge variant to use
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <Badge>Available</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Pending</Badge>;
      case 'sold':
        return <Badge variant="secondary">Sold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to determine the badge color based on the status
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'default';
      case 'pending':
        return 'outline';
      case 'sold':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Function to get the status filter condition
  const getStatusFilterCondition = (status: string) => {
    if (status.toLowerCase() === 'available') {
      return { status: 'available' };
    } else if (status.toLowerCase() === 'pending') {
      return { status: 'pending' };
    } else if (status.toLowerCase() === 'sold') {
      return { status: 'sold' };
    }
    return {};
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-normal tracking-tight">Properties</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => navigate('/properties/new')}
          >
            <Plus size={16} />
            Add Property
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by title, city, address..."
              className="w-full h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Properties</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min-price" className="text-right">
                    Min Price
                  </Label>
                  <Input
                    type="number"
                    id="min-price"
                    value={minPrice !== undefined ? minPrice.toString() : ''}
                    onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="max-price" className="text-right">
                    Max Price
                  </Label>
                  <Input
                    type="number"
                    id="max-price"
                    value={maxPrice !== undefined ? maxPrice.toString() : ''}
                    onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="property-type" className="text-right">
                    Property Type
                  </Label>
                  <Select onValueChange={setPropertyType} defaultValue={propertyType || ''}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select onValueChange={setStatusFilter} defaultValue={statusFilter || ''}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={handleFiltersReset}>
                  Reset
                </Button>
                <Button type="button" onClick={handleFiltersApply}>
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" type="submit">Search</Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {Array(12).fill(0).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-md" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <p className="text-red-500">Error loading properties. Please try again.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No properties found.</p>
            <Button
              className="mt-4"
              onClick={() => navigate('/properties/new')}
            >
              Create your first property
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {currentPage * 12 + 1} to {Math.min((currentPage + 1) * 12, totalProperties)} of {totalProperties} properties
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Properties;
