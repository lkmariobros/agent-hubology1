
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Building, Shield, ChevronDown } from 'lucide-react';
import { useAuth, UserRole } from '@/providers/AuthProvider';

export function PortalSwitcher() {
  const { user, switchRole, isAdmin } = useAuth();
  
  // Only show this component for users with admin privileges
  if (!user || !isAdmin) return null;
  
  const currentRole = user.activeRole;
  const isAdminActive = currentRole === 'admin';

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 h-auto p-0 font-normal text-lg hover:bg-transparent"
        >
          <span>PropertyPro</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-[180px]">
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('agent')}
          className={`flex items-center cursor-pointer ${!isAdminActive ? 'bg-accent/10' : ''}`}
        >
          <Building className="h-4 w-4 mr-2" />
          <span>Agent Portal</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('admin')}
          className={`flex items-center cursor-pointer ${isAdminActive ? 'bg-accent/10' : ''}`}
        >
          <Shield className="h-4 w-4 mr-2" />
          <span>Admin Portal</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
