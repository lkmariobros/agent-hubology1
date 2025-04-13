import React, { useState, useEffect } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import PageBreadcrumb from './PageBreadcrumb';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedHeaderProps {
  className?: string;
  isAdmin?: boolean;
  onSwitchRole?: (role: 'agent' | 'admin') => void;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ 
  className,
  isAdmin = false,
  onSwitchRole
}) => {
  const { activeRole, switchRole, hasRole } = useClerkAuth();
  const [currentRole, setCurrentRole] = useState<'agent' | 'admin'>(activeRole as 'agent' | 'admin');

  // Update current role when activeRole changes
  useEffect(() => {
    setCurrentRole(activeRole as 'agent' | 'admin');
  }, [activeRole]);

  const handleRoleSwitch = (role: 'agent' | 'admin') => {
    // Use the Clerk auth switchRole function
    switchRole(role);
    
    // Set local state
    setCurrentRole(role);
    
    // Call the parent component's handler if provided
    if (onSwitchRole) {
      onSwitchRole(role);
    } else {
      // Default behavior if no handler is provided
      if (role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-[#1A1F2C] px-4 ${className}`}>
      <SidebarTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SidebarTrigger>
      
      <div className="flex-1">
        <PageBreadcrumb />
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1 border-gray-700 bg-gray-800 text-gray-200">
              <span className="capitalize">{currentRole} Portal</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-gray-800 border-gray-700">
            <DropdownMenuItem 
              className={`capitalize ${currentRole === 'agent' ? 'bg-purple-900/30 text-purple-300' : ''}`}
              onClick={() => handleRoleSwitch('agent')}
              disabled={!hasRole('agent')}
            >
              Agent Portal
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`capitalize ${currentRole === 'admin' ? 'bg-purple-900/30 text-purple-300' : ''}`}
              onClick={() => handleRoleSwitch('admin')}
              disabled={!hasRole('admin')}
            >
              Admin Portal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserButton 
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8",
            }
          }}
        />
      </div>
    </header>
  );
};

export default EnhancedHeader;
