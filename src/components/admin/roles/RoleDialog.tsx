
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Role, Permission, PermissionCategory } from '@/types/role';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionSelector } from './PermissionSelector';
import { roleService } from '@/services/roleService';

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
  
  const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  
  // Fetch permissions when dialog opens
  useEffect(() => {
    if (open) {
      loadPermissions();
      
      reset({
        name: role?.name || '',
        description: role?.description || ''
      });
    }
  }, [open, role, reset]);
  
  // Load permissions and categories
  const loadPermissions = async () => {
    setLoading(true);
    try {
      const categories = await roleService.getPermissionsByCategories();
      setPermissionCategories(categories);
      
      // If editing an existing role, fetch its permissions
      if (role?.id) {
        const roleDetail = await roleService.getRole(role.id);
        if (roleDetail && roleDetail.permissions) {
          setSelectedPermissions(roleDetail.permissions.map(p => ({ ...p, selected: true })));
        }
      } else {
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle permission selection changes
  const handlePermissionChange = (permissions: Permission[]) => {
    setSelectedPermissions(permissions.filter(p => p.selected));
  };
  
  // Handle form submission
  const handleFormSubmit = (values: RoleFormValues) => {
    onSubmit({
      ...values,
      permissions: selectedPermissions
    });
  };

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
              {loading ? (
                <div className="text-center py-4">Loading permissions...</div>
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
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
