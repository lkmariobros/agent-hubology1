
import React, { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyTable } from '@/components/property/PropertyTable';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { mapPropertyData } from '@/utils/propertyUtils';
import DatabaseError from '@/components/ui/database-error';

interface PropertyListContainerProps {
  page: number;
  pageSize: number;
  filters: any;
  view: 'grid' | 'table';
  setPage: (page: number) => void;
}

const PropertyListContainer: React.FC<PropertyListContainerProps> = ({
  page,
  pageSize,
  filters,
  view,
  setPage
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const { data, isLoading, error, refetch } = useProperties(page, pageSize, filters);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };
  
  const handleGetHelp = () => {
    window.open('https://docs.example.com/database-connection-issues', '_blank');
  };
  
  // Handle connection errors specifically
  if (error && (error.message.includes('Failed to fetch') || error.message.includes('connect to database'))) {
    return (
      <DatabaseError 
        title="Database Connection Error"
        message="Failed to read tables from your Supabase database. Please try again later."
        onRetry={handleRetry}
        onHelp={handleGetHelp}
      />
    );
  }
  
  // Handle other errors
  if (error) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-destructive">Error loading properties: {error.message}</p>
        <Button onClick={handleRetry} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading properties...</p>
      </div>
    );
  }
  
  // Show empty state
  if (!data || data.properties.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-muted-foreground">No properties found. Try adjusting your filters or create a new property.</p>
        <Link to="/properties/new">
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </Link>
      </div>
    );
  }

  // Map data to our format
  const properties = data.properties.map(property => mapPropertyData(property));
  
  // Show pagination
  const renderPagination = () => {
    if (!data || data.totalCount <= pageSize) return null;
    
    const totalPages = Math.ceil(data.totalCount / pageSize);
    
    return (
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4 bg-muted rounded">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <>
      {view === 'grid' ? (
        <PropertyGrid properties={properties} />
      ) : (
        <PropertyTable properties={properties} />
      )}
      
      {renderPagination()}
    </>
  );
};

export default PropertyListContainer;
