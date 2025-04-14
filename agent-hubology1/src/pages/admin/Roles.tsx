
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Eye, Edit, Trash2, Loader2, Users } from 'lucide-react';
import { Role } from '@/types/role';
import { useRoles } from '@/hooks/useRoles';
import { RoleDialog } from '@/components/admin/roles/RoleDialog';
import { DeleteRoleDialog } from '@/components/admin/roles/DeleteRoleDialog';
import { RoleUsers } from '@/components/admin/roles/RoleUsers';

const Roles = () => {
  const { 
    roles, 
    isLoading, 
    createRole, 
    updateRole, 
    deleteRole,
    isCreating,
    isUpdating,
    isDeleting 
  } = useRoles();

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false);
  const [isViewUsersOpen, setIsViewUsersOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleOpenAddRole = () => {
    setIsAddRoleOpen(true);
  };

  const handleOpenEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditRoleOpen(true);
  };

  const handleOpenDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteRoleOpen(true);
  };

  const handleOpenViewUsers = (role: Role) => {
    setSelectedRole(role);
    setIsViewUsersOpen(true);
  };

  const handleCloseAddRole = () => {
    setIsAddRoleOpen(false);
  };

  const handleCloseEditRole = () => {
    setSelectedRole(null);
    setIsEditRoleOpen(false);
  };

  const handleCloseDeleteRole = () => {
    setSelectedRole(null);
    setIsDeleteRoleOpen(false);
  };

  const handleCloseViewUsers = () => {
    setSelectedRole(null);
    setIsViewUsersOpen(false);
  };

  const handleCreateRole = async (values: { name: string; description: string }) => {
    await createRole(values);
    setIsAddRoleOpen(false);
  };

  const handleUpdateRole = async (values: { name: string; description: string }) => {
    if (selectedRole) {
      await updateRole(selectedRole.id, values);
      setIsEditRoleOpen(false);
      setSelectedRole(null);
    }
  };

  const handleDeleteRole = async () => {
    if (selectedRole) {
      await deleteRole(selectedRole.id);
      setIsDeleteRoleOpen(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="space-y-6 px-[44px] py-[36px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage roles and access permissions for system users.
          </p>
        </div>
        <Button className="gap-2" onClick={handleOpenAddRole}>
          <Plus size={16} />
          Add New Role
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Roles
          </CardTitle>
          <CardDescription>
            Configure access levels and permissions for each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading roles...
                      </div>
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                      No roles found. Create your first role to get started.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{role.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{role.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{role.users_count || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleOpenViewUsers(role)}>
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleOpenEditRole(role)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleOpenDeleteRole(role)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Dialogs */}
      <RoleDialog
        open={isAddRoleOpen}
        onClose={handleCloseAddRole}
        onSubmit={handleCreateRole}
        isSubmitting={isCreating}
        title="Create New Role"
      />

      <RoleDialog
        open={isEditRoleOpen}
        onClose={handleCloseEditRole}
        onSubmit={handleUpdateRole}
        role={selectedRole}
        isSubmitting={isUpdating}
        title="Edit Role"
      />

      <DeleteRoleDialog
        open={isDeleteRoleOpen}
        onClose={handleCloseDeleteRole}
        onConfirm={handleDeleteRole}
        role={selectedRole}
        isDeleting={isDeleting}
      />

      <RoleUsers
        open={isViewUsersOpen}
        onClose={handleCloseViewUsers}
        role={selectedRole}
      />
    </div>
  );
};

export default Roles;
