
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
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { isSpecialAdmin } from '@/utils/adminAccess';
import { cn } from '@/lib/utils';

/**
 * Unified component that allows users to switch between different roles/portals
 */
interface PortalSwitcherProps {
  showLabel?: boolean;
  className?: string;
}

export function PortalSwitcher({ showLabel = true, className }: PortalSwitcherProps) {
  const { user, switchRole, isAdmin, activeRole } = useAuth();
  
  if (!user) return null;
  
  // Calculate which roles the user can switch to
  const availableRoles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'agent', label: 'Agent Portal', icon: <Building className="h-4 w-4 mr-2" /> },
  ];
  
  // Use centralized special admin check
  const isSpecialAdminUser = isSpecialAdmin(user.email);
  console.log('PortalSwitcher: Special admin check:', isSpecialAdminUser);
  
  if (isAdmin || isSpecialAdminUser) {
    availableRoles.push({ 
      role: 'admin', 
      label: 'Admin Portal', 
      icon: <Shield className="h-4 w-4 mr-2" /> 
    });
  }
  
  // Filter out the current role
  const otherRoles = availableRoles.filter(item => item.role !== activeRole);
  
  // Get info about current role for display
  const currentRoleInfo = availableRoles.find(item => item.role === activeRole);
  
  if (!currentRoleInfo) return null;

  const handleSwitchRole = (role: UserRole) => {
    // Show toast message before switching
    toast.success(`Switching to ${role === 'admin' ? 'Admin' : 'Agent'} Portal...`);
    
    // First switch the role
    switchRole(role);
    
    // Use hardcoded paths for redirection to ensure consistency
    const redirectPath = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    
    // Add a slight delay to allow the role switch to complete
    setTimeout(() => {
      // Hard redirect to correct portal with full page reload
      console.log(`PortalSwitcher: Hard redirect to ${redirectPath}`);
      window.location.href = redirectPath;
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("gap-1 border-dashed", className)}
        >
          {currentRoleInfo.icon}
          {showLabel && <span className="hidden sm:inline-block">{currentRoleInfo.label}</span>}
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
            onClick={() => handleSwitchRole(item.role)}
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

export default PortalSwitcher;
