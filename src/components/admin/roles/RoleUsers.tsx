
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { roleService } from '@/services/roleService';
import { Role } from '@/types/role';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, UserPlus2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

interface RoleUsersProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
}

export function RoleUsers({ open, onClose, role }: RoleUsersProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [allAgents, setAllAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadUsers = async () => {
      if (role?.id && open) {
        setLoading(true);
        try {
          const usersWithRole = await roleService.getUsersWithRole(role.id);
          setUsers(usersWithRole);
        } catch (error) {
          console.error('Error loading users:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadUsers();
  }, [role?.id, open]);
  
  const handleOpenAddUser = async () => {
    setAddUserDialogOpen(true);
    
    try {
      // Load all agents who don't have this role
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('id, full_name, email, avatar_url')
        .order('full_name');
        
      if (error) throw error;
      
      // Filter out users who already have this role
      const userIds = users.map(u => u.user_id);
      const filteredAgents = data.filter(agent => !userIds.includes(agent.id));
      
      setAllAgents(filteredAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };
  
  const handleCloseAddUser = () => {
    setAddUserDialogOpen(false);
    setSearchQuery('');
  };
  
  const handleRemoveRole = async (userId: string) => {
    if (role?.id) {
      try {
        await roleService.removeRoleFromUser(userId, role.id);
        setUsers(users.filter(u => u.user_id !== userId));
      } catch (error) {
        console.error('Error removing role:', error);
      }
    }
  };
  
  const handleAddRole = async (userId: string) => {
    if (role?.id) {
      try {
        await roleService.assignRoleToUser(userId, role.id);
        handleCloseAddUser();
        
        // Reload users
        const usersWithRole = await roleService.getUsersWithRole(role.id);
        setUsers(usersWithRole);
      } catch (error) {
        console.error('Error assigning role:', error);
      }
    }
  };
  
  const filteredAgents = searchQuery.trim() === '' 
    ? allAgents 
    : allAgents.filter(agent => 
        agent.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  if (!role) return null;
  
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Users with {role.name} Role</DialogTitle>
            <DialogDescription>
              Manage users assigned to the {role.name} role
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-between items-center my-4">
            <div className="text-sm text-muted-foreground">
              {users.length} {users.length === 1 ? 'user' : 'users'} with this role
            </div>
            <Button size="sm" onClick={handleOpenAddUser}>
              <UserPlus2 className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users have been assigned this role yet.
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((userRole) => (
                  <div 
                    key={userRole.user_id}
                    className="flex items-center justify-between p-3 rounded-md border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={userRole.agent_profiles?.avatar_url} 
                          alt={userRole.agent_profiles?.full_name || "User"} 
                        />
                        <AvatarFallback>
                          {(userRole.agent_profiles?.full_name || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {userRole.agent_profiles?.full_name || "Unknown User"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {userRole.agent_profiles?.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRole(userRole.user_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={addUserDialogOpen} onOpenChange={(isOpen) => !isOpen && handleCloseAddUser()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Users to {role.name} Role</DialogTitle>
            <DialogDescription>
              Select users to assign the {role.name} role
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery.trim() !== '' 
                  ? "No matching users found" 
                  : "No users available to add"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAgents.map((agent) => (
                  <div 
                    key={agent.id}
                    className="flex items-center justify-between p-3 rounded-md border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={agent.avatar_url} 
                          alt={agent.full_name || "User"} 
                        />
                        <AvatarFallback>
                          {(agent.full_name || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {agent.full_name || "Unknown User"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {agent.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddRole(agent.id)}
                    >
                      Add Role
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddUser}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
