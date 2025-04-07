
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Building, Shield, ChevronsUpDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

interface PortalSwitcherProps {
  showLabel?: boolean;
  className?: string;
}

/**
 * Component that allows users with multiple roles to switch between portals
 */
export function PortalSwitcher({ showLabel = true, className = "" }: PortalSwitcherProps) {
  const { isAdmin, activeRole, switchRole, roles, user } = useAuth();
  const isAdminActive = activeRole === 'admin';
  const [hasAdminRole, setHasAdminRole] = useState(false);
  
  // Check for special admin user (josephkwantum@gmail.com)
  const isSpecialAdminUser = user?.email === 'josephkwantum@gmail.com';
  
  useEffect(() => {
    // Force recheck for admin role
    setHasAdminRole(roles.includes('admin'));
    console.log('PortalSwitcher: roles updated', roles, 'isAdmin:', isAdmin, 'hasAdmin:', roles.includes('admin'));
  }, [roles, isAdmin]);
  
  // For non-admin users who aren't the special admin user, just show the logo without dropdown functionality
  if (!isAdmin && !hasAdminRole && !isSpecialAdminUser) {
    return (
      <div className={`flex items-center px-2 py-2 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <span className="font-bold text-sm">P</span>
          </div>
          {showLabel && (
            <span className="text-lg font-semibold">PropertyPro</span>
          )}
        </div>
      </div>
    );
  }

  // For admin users or special admin user, show the dropdown with portal switching options
  const handleSwitchRole = (role: UserRole) => {
    // Show toast notification before switching
    toast.success(`Switching to ${role === 'admin' ? 'Admin' : 'Agent'} Portal...`);
    
    // First switch the role
    switchRole(role);
    
    // Add a slight delay to allow the role switch to complete
    setTimeout(() => {
      // Hard redirect to the appropriate portal
      if (role === 'admin') {
        console.log('PortalSwitcher: Hard redirect to /admin/dashboard');
        window.location.href = '/admin/dashboard';
      } else {
        console.log('PortalSwitcher: Hard redirect to /dashboard');
        window.location.href = '/dashboard';
      }
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={`flex items-center justify-between w-full px-2 py-2 hover:bg-gray-800/30 rounded-md transition-colors focus:outline-none ${className}`}
          aria-label="Switch between portals"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
              <span className="font-bold text-sm">P</span>
            </div>
            {showLabel && (
              <span className="text-lg font-semibold">PropertyPro</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-60 ml-2" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-[220px] bg-gray-900/95 text-white border-gray-700">
        <DropdownMenuItem 
          onClick={() => handleSwitchRole('agent')}
          className={`flex items-center cursor-pointer hover:bg-gray-800 ${!isAdminActive ? 'bg-gray-800/50' : ''}`}
        >
          <Building className="h-4 w-4 mr-2" />
          <span>Agent Portal</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={() => handleSwitchRole('admin')}
          className={`flex items-center cursor-pointer hover:bg-gray-800 ${isAdminActive ? 'bg-gray-800/50' : ''}`}
        >
          <Shield className="h-4 w-4 mr-2" />
          <span>Admin Portal</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
