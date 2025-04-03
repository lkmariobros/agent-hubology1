
import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Building, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/providers/ClerkAuthProvider';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Component that allows users to switch between different roles/portals
 * Displayed in the header rather than sidebar
 */
export function TeamSwitcher() {
  const { user, switchRole, isAdmin, activeRole } = useAuth();
  
  if (!user) return null;
  
  // Calculate which roles the user can switch to
  const availableRoles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'agent', label: 'Agent Portal', icon: <Building className="h-4 w-4 mr-2" /> },
  ];
  
  // Always add admin option for the special email
  const isSpecialEmail = user.email === 'josephkwantum@gmail.com';
  if (isAdmin || isSpecialEmail) {
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
    
    // Add a slight delay to allow the role switch to complete
    setTimeout(() => {
      // Hard redirect to correct portal with full page reload
      if (role === 'admin') {
        console.log('TeamSwitcher: Hard reload to /admin after role switch');
        window.location.href = '/admin';
      } else {
        console.log('TeamSwitcher: Hard reload to /dashboard after role switch');
        window.location.href = '/dashboard';
      }
    }, 100);
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
