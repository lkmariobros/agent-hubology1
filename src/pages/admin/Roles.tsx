
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const Roles = () => {
  // Sample role data
  const roles = [
    { id: 1, name: 'Administrator', description: 'Full system access', users: 5 },
    { id: 2, name: 'Team Leader', description: 'Manage team and approve transactions', users: 12 },
    { id: 3, name: 'Senior Agent', description: 'Access to all properties and transactions', users: 28 },
    { id: 4, name: 'Junior Agent', description: 'Limited access to transactions', users: 45 },
    { id: 5, name: 'Finance Officer', description: 'Access to commission data and payments', users: 3 },
  ];

  return (
    <div className="space-y-6 px-[44px] py-[36px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage roles and access permissions for system users.
          </p>
        </div>
        <Button className="gap-2">
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
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{role.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{role.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{role.users}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roles;
