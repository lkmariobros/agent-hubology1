
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Building, Shield, ChevronDown } from 'lucide-react';
import { useAuth, UserRole } from '@/providers/AuthProvider';

export function PortalSwitcher() {
  const { user, switchRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Only show this component for users with admin privileges
  if (!user || !isAdmin) return null;
  
  const currentRole = user.activeRole;

  // Define our two portals
  const portals: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'agent', label: 'Agent Portal', icon: <Building className="h-4 w-4" /> },
    { role: 'admin', label: 'Admin Portal', icon: <Shield className="h-4 w-4" /> }
  ];
  
  // Get info about current portal for display
  const currentPortal = portals.find(item => item.role === currentRole);
  
  if (!currentPortal) return null;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-none bg-background/10 hover:bg-background/20"
        >
          <div className="flex items-center justify-center h-5 w-5 rounded-md overflow-hidden">
            {currentPortal.icon}
          </div>
          <span className="font-medium">{currentPortal.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="uppercase text-xs text-muted-foreground/60">
          Switch Portal
        </DropdownMenuLabel>
        
        {portals.map((portal) => (
          <DropdownMenuItem 
            key={portal.role}
            onClick={() => handleRoleSwitch(portal.role)}
            className={`gap-2 p-2 cursor-pointer ${portal.role === currentRole ? 'bg-accent/50' : ''}`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md">
              {portal.icon}
            </div>
            {portal.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
