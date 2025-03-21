
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

export function TeamSwitcher() {
  const { user, switchRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const currentRole = user.activeRole;

  // Calculate which roles the user can switch to
  const availableRoles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'agent', label: 'Agent Portal', icon: <Building className="h-4 w-4 mr-2" /> },
  ];
  
  // Only add admin option if the user has admin access
  if (isAdmin) {
    availableRoles.push({ 
      role: 'admin', 
      label: 'Admin Portal', 
      icon: <Shield className="h-4 w-4 mr-2" /> 
    });
  }
  
  // Filter out the current role
  const otherRoles = availableRoles.filter(item => item.role !== currentRole);
  
  // Get info about current role for display
  const currentRoleInfo = availableRoles.find(item => item.role === currentRole);
  
  if (!currentRoleInfo) return null;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-1 border-dashed"
        >
          {currentRoleInfo.icon}
          <span className="hidden sm:inline-block">{currentRoleInfo.label}</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem disabled className="text-muted-foreground">
          Switch to...
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {otherRoles.map((item) => (
          <DropdownMenuItem 
            key={item.role}
            onClick={() => handleRoleSwitch(item.role)}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              {item.icon}
              {item.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
