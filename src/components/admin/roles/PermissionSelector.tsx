
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission, PermissionCategory } from '@/types/role';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PermissionSelectorProps {
  permissionCategories: PermissionCategory[];
  selectedPermissions: Permission[];
  onPermissionChange: (updatedPermissions: Permission[]) => void;
}

export function PermissionSelector({ 
  permissionCategories, 
  selectedPermissions, 
  onPermissionChange 
}: PermissionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Prepare permissions with selection state
  const preparePermissions = () => {
    const preparedCategories = JSON.parse(JSON.stringify(permissionCategories)) as PermissionCategory[];
    
    // Mark permissions as selected based on selectedPermissions
    preparedCategories.forEach(category => {
      category.permissions.forEach(permission => {
        permission.selected = selectedPermissions.some(p => p.id === permission.id);
      });
    });
    
    return preparedCategories;
  };
  
  const [preparedCategories, setPreparedCategories] = useState<PermissionCategory[]>(preparePermissions());
  
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
    
    // Collect all permissions from all categories
    const allPermissions = updatedCategories.flatMap(c => c.permissions);
    onPermissionChange(allPermissions);
  };
  
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
      
      <div className="border rounded-md max-h-60 overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No permissions found matching "{searchTerm}"
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
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
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
        {selectedPermissions.filter(p => p.selected).length} permissions selected
      </div>
    </div>
  );
}
