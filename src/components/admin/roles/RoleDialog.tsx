
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Role, Permission, PermissionCategory } from '@/types/role';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionSelector } from './PermissionSelector';
import { useRoles } from '@/hooks/useRoles';
import LoadingIndicator from '@/components/ui/loading-indicator';

interface RoleFormValues {
  name: string;
  description: string;
}

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues & { permissions?: Permission[] }) => void;
  role?: Role | null;
  isSubmitting: boolean;
  title: string;
}

export function RoleDialog({
  open,
  onClose,
  onSubmit,
  role,
  isSubmitting,
  title
}: RoleDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleFormValues>({
    defaultValues: {
      name: role?.name || '',
      description: role?.description || ''
    }
  });
  
  const { 
    permissionCategories, 
    isLoadingCategories,
    loadRolePermissions
  } = useRoles();
  
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  
  // Reset form when dialog opens or role changes
  useEffect(() => {
    if (open) {
      reset({
        name: role?.name || '',
        description: role?.description || ''
      });
      
      // Load role permissions if editing
      if (role?.id) {
        loadRolePermissionsForRole(role.id);
      } else {
        setSelectedPermissions([]);
      }
    }
  }, [open, role, reset]);
  
  // Load permissions for a specific role
  const loadRolePermissionsForRole = async (roleId: string) => {
    try {
      setLoading(true);
      const permissions = await loadRolePermissions(roleId);
      setSelectedPermissions(permissions.map(p => ({ ...p, selected: true })));
    } catch (error) {
      console.error('Error loading role permissions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle permission selection changes
  const handlePermissionChange = (permissions: Permission[]) => {
    setSelectedPermissions(permissions);
  };
  
  // Handle form submission
  const handleFormSubmit = (values: RoleFormValues) => {
    onSubmit({
      ...values,
      permissions: selectedPermissions
    });
  };
  
  const isLoadingData = isLoadingCategories || loading;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {role ? 'Update the role details and permissions below.' : 'Create a new role with the form below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Role Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g. Team Leader"
                  {...register('name', { required: 'Role name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="e.g. Can manage team members and approve transactions"
                  {...register('description')}
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4 pt-4">
              {isLoadingData ? (
                <div className="flex justify-center py-8">
                  <LoadingIndicator text="Loading permissions..." />
                </div>
              ) : (
                <PermissionSelector
                  permissionCategories={permissionCategories}
                  selectedPermissions={selectedPermissions}
                  onPermissionChange={handlePermissionChange}
                />
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting || isLoadingData}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingData}>
              {isSubmitting ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
