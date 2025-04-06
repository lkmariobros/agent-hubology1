
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyListContainer from '@/components/property/PropertyListContainer';

const AdminProperties = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  
  // Apply filters
  const filters = {
    ...(searchTerm && { title: searchTerm }),
    ...(selectedPropertyType !== 'all' && { propertyType: selectedPropertyType })
  };
  
  // Handle property type change
  const handlePropertyTypeChange = (value: string) => {
    setSelectedPropertyType(value);
    setPage(1); // Reset to first page when changing filters
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search term state is already set via onChange, so just prevent default form submission
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Link to="/properties/new">
          <Button className="mt-3 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search properties..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" type="button" onClick={() => {
                setSearchTerm('');
                setSelectedPropertyType('all');
                setPage(1);
              }}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="grid" onValueChange={(value) => setView(value as 'grid' | 'table')}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select 
              value={selectedPropertyType} 
              onValueChange={handlePropertyTypeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <PropertyListContainer 
          page={page}
          pageSize={pageSize}
          filters={filters}
          view={view}
          setPage={setPage}
        />
      </Tabs>
    </div>
  );
};

export default AdminProperties;
