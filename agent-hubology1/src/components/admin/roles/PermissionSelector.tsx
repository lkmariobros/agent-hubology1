
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission, PermissionCategory } from '@/types/role';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import LoadingIndicator from '@/components/ui/loading-indicator';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PermissionSelectorProps {
  permissionCategories: PermissionCategory[];
  selectedPermissions: Permission[];
  onPermissionChange: (updatedPermissions: Permission[]) => void;
  isLoading?: boolean;
  error?: Error | null | string;
  onRetry?: () => void;
}

export function PermissionSelector({ 
  permissionCategories, 
  selectedPermissions, 
  onPermissionChange,
  isLoading = false,
  error,
  onRetry
}: PermissionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [preparedCategories, setPreparedCategories] = useState<PermissionCategory[]>([]);
  
  // Prepare permissions with selection state
  useEffect(() => {
    if (permissionCategories.length > 0) {
      const prepared = JSON.parse(JSON.stringify(permissionCategories)) as PermissionCategory[];
      
      // Mark permissions as selected based on selectedPermissions
      prepared.forEach(category => {
        category.permissions.forEach(permission => {
          permission.selected = selectedPermissions.some(p => p.id === permission.id);
        });
      });
      
      setPreparedCategories(prepared);
    }
  }, [permissionCategories, selectedPermissions]);
  
  // Filter permissions based on search term
  const filteredCategories = preparedCategories
    .map(category => ({
      ...category,
      permissions: category.permissions.filter(permission => 
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }))
    .filter(category => category.permissions.length > 0);
  
  // Handle permission checkbox change
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const updatedCategories = preparedCategories.map(category => ({
      ...category,
      permissions: category.permissions.map(permission => 
        permission.id === permissionId 
          ? { ...permission, selected: checked } 
          : permission
      )
    }));
    
    setPreparedCategories(updatedCategories);
    
    // Collect all selected permissions from all categories
    const allSelectedPermissions = updatedCategories
      .flatMap(c => c.permissions)
      .filter(p => p.selected);
      
    onPermissionChange(allSelectedPermissions);
  };
  
  if (isLoading) {
    return <LoadingIndicator size="md" text="Loading permissions..." />;
  }
  
  const errorMessage = error ? (typeof error === 'string' ? error : error.message || 'Failed to load permissions') : null;
  
  if (errorMessage) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-row items-center justify-between">
          <span>{errorMessage}</span>
          {onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRetry} 
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  const hasPermissions = preparedCategories.length > 0 && preparedCategories.some(c => c.permissions.length > 0);
  const selectedCount = preparedCategories
    .flatMap(c => c.permissions)
    .filter(p => p.selected)
    .length;
    
  if (!hasPermissions) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-row items-center justify-between">
          <span>No permissions available to display.</span>
          {onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRetry} 
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search permissions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md max-h-[300px] overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchTerm ? `No permissions found matching "${searchTerm}"` : 'No permissions available'}
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {filteredCategories.map((category) => (
              <AccordionItem value={category.name} key={category.name}>
                <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 p-2">
                    {category.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-2 p-2 rounded hover:bg-muted">
                        <Checkbox 
                          id={permission.id} 
                          checked={permission.selected}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                        />
                        <div className="grid gap-1">
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </label>
                          {permission.description && (
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
      
      <div className="pt-2 text-xs text-muted-foreground">
        {selectedCount} permissions selected
      </div>
    </div>
  );
}
