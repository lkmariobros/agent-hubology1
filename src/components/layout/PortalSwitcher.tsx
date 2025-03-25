
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Building, Shield, ChevronsUpDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PortalSwitcherProps {
  showLabel?: boolean;
  className?: string;
}

export function PortalSwitcher({ showLabel = true, className = "" }: PortalSwitcherProps) {
  const { isAdmin, switchRole } = useAuth();
  
  // Only show this component for users with admin privileges
  if (!isAdmin) return null;
  
  const currentRole = window.location.pathname.startsWith('/admin') ? 'admin' : 'agent';
  const isAdminActive = currentRole === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={`flex items-center justify-between w-full hover:opacity-80 transition-colors focus:outline-none ${className}`}
          aria-label="Switch between portals"
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
              <span className="font-bold text-sm">P</span>
            </div>
            {showLabel && (
              <span className="ml-2 text-lg font-semibold">PropertyPro</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-[180px] bg-popover">
        <DropdownMenuItem 
          onClick={() => switchRole('agent')}
          className={`flex items-center cursor-pointer ${!isAdminActive ? 'bg-accent/10' : ''}`}
        >
          <Building className="h-4 w-4 mr-2" />
          <span>Agent Portal</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => switchRole('admin')}
          className={`flex items-center cursor-pointer ${isAdminActive ? 'bg-accent/10' : ''}`}
        >
          <Shield className="h-4 w-4 mr-2" />
          <span>Admin Portal</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
