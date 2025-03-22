
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Building, Shield, ChevronDown } from 'lucide-react';
import { useAuth, UserRole } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function PortalSwitcher() {
  const { user, switchRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Only show this component for users with admin privileges
  if (!user || !isAdmin) return null;
  
  const currentRole = user.activeRole;

  // Define the portals available to switch between
  const portals = [
    { role: 'agent', label: 'Agent Portal', icon: <Building className="h-4 w-4 mr-2" /> },
    { role: 'admin', label: 'Admin Portal', icon: <Shield className="h-4 w-4 mr-2" /> }
  ];

  // Get the current portal for display
  const currentPortal = portals.find(p => p.role === currentRole);
  
  // Get the other portal option
  const otherPortal = portals.find(p => p.role !== currentRole);

  if (!currentPortal || !otherPortal) return null;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center text-sm font-medium hover:bg-accent/10 ml-2"
        >
          {currentPortal.icon}
          <span className="hidden sm:inline-block">{currentPortal.label}</span>
          <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[180px] bg-popover p-2 shadow-md">
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch(otherPortal.role as UserRole)}
          className="flex items-center cursor-pointer px-3 py-2 rounded-sm hover:bg-accent"
        >
          {otherPortal.icon}
          <span>Switch to {otherPortal.label}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
