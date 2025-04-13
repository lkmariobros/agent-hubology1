import React, { useState, useEffect } from 'react';
import { useRoleHierarchy } from '@/hooks/useRoleHierarchy';
import { useRoles } from '@/hooks/useRoles';
import { Role } from '@/types/role';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ChevronRight, ChevronDown, Plus, Trash2, RefreshCw, ArrowDownUp } from 'lucide-react';

const RoleHierarchyManager: React.FC = () => {
  const { 
    hierarchyData, 
    flattenedHierarchy, 
    selectedRoleId, 
    setSelectedRoleId, 
    extendedRole,
    addRoleRelationship,
    removeRoleRelationship,
    refreshAll,
    isLoading
  } = useRoleHierarchy();
  
  const { roles } = useRoles();
  
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [parentRoleId, setParentRoleId] = useState<string>('');
  const [childRoleId, setChildRoleId] = useState<string>('');

  // Reset selected roles when hierarchy data changes
  useEffect(() => {
    if (roles.length > 0) {
      setParentRoleId(roles[0].id);
      setChildRoleId(roles[0].id);
    }
  }, [roles]);

  // Toggle a node's collapsed state
  const toggleCollapse = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle adding a role relationship
  const handleAddRelationship = async () => {
    if (parentRoleId === childRoleId) {
      toast.error('A role cannot be its own parent');
      return;
    }
    
    try {
      await addRoleRelationship(parentRoleId, childRoleId);
    } catch (error) {
      console.error('Error adding role relationship:', error);
    }
  };

  // Handle removing a role relationship
  const handleRemoveRelationship = async (parentId: string, childId: string) => {
    try {
      await removeRoleRelationship(parentId, childId);
    } catch (error) {
      console.error('Error removing role relationship:', error);
    }
  };

  // Render a role node in the hierarchy tree
  const renderRoleNode = (node: any) => {
    const isCollapsed = collapsed[node.id];
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="mb-1" style={{ marginLeft: `${node.depth * 24}px` }}>
        <div className="flex items-center py-1">
          {hasChildren && (
            <button 
              onClick={() => toggleCollapse(node.id)} 
              className="mr-1 p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          {!hasChildren && <span className="w-6" />}
          
          <span 
            className={`px-2 py-1 rounded cursor-pointer ${selectedRoleId === node.id ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setSelectedRoleId(node.id)}
          >
            {node.name}
          </span>
          
          {node.circular && (
            <Badge variant="destructive" className="ml-2 text-xs">Circular Reference</Badge>
          )}
        </div>
        
        {hasChildren && !isCollapsed && (
          <div className="border-l border-gray-300 dark:border-gray-700 ml-3 pl-2">
            {node.children.map((child: any) => renderRoleNode(child))}
          </div>
        )}
      </div>
    );
  };

  // Render the selected role details
  const renderSelectedRoleDetails = () => {
    if (!selectedRoleId || !extendedRole) {
      return (
        <div className="text-center py-8 text-gray-500">
          Select a role to view details
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Role Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{extendedRole.description}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Parent Roles</h4>
          {extendedRole.parent_roles && extendedRole.parent_roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {extendedRole.parent_roles.map(role => (
                <div key={role.id} className="flex items-center">
                  <Badge variant="outline" className="mr-1">{role.name}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => handleRemoveRelationship(role.id, selectedRoleId)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No parent roles</p>
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Child Roles</h4>
          {extendedRole.child_roles && extendedRole.child_roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {extendedRole.child_roles.map(role => (
                <div key={role.id} className="flex items-center">
                  <Badge variant="outline" className="mr-1">{role.name}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => handleRemoveRelationship(selectedRoleId, role.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No child roles</p>
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Inherited Permissions</h4>
          {extendedRole.inherited_permissions && extendedRole.inherited_permissions.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {extendedRole.inherited_permissions.map(perm => (
                <Badge key={perm.id} variant="secondary" className="justify-start">
                  {perm.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No inherited permissions</p>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy</CardTitle>
          <CardDescription>Loading role hierarchy data...</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Role Hierarchy</CardTitle>
              <CardDescription>Manage parent-child relationships between roles</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={refreshAll}>
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Panel: Tree View */}
            <div className="border rounded-md p-4 overflow-auto max-h-[500px]">
              <h3 className="font-medium mb-2">Role Hierarchy Tree</h3>
              <div className="mb-4">
                {flattenedHierarchy().length > 0 ? (
                  <div>
                    {flattenedHierarchy()
                      .filter(node => node.depth === 0)
                      .map(node => renderRoleNode(node))}
                  </div>
                ) : (
                  <p className="text-gray-500">No role hierarchy defined yet</p>
                )}
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Add New Relationship</h4>
                <div className="grid gap-2">
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="col-span-2">
                      <Select value={parentRoleId} onValueChange={setParentRoleId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-center">
                      <ArrowDownUp size={20} className="rotate-90" />
                    </div>
                    
                    <div className="col-span-2">
                      <Select value={childRoleId} onValueChange={setChildRoleId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select child role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={handleAddRelationship}>
                    <Plus size={16} className="mr-2" />
                    Add Relationship
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right Panel: Selected Role Details */}
            <div className="border rounded-md p-4 overflow-auto max-h-[500px]">
              {renderSelectedRoleDetails()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleHierarchyManager;