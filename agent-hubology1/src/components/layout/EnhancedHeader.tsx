import React, { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import PageBreadcrumb from './PageBreadcrumb';
import { useAuth } from '@/hooks/useAuth';
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
  const { activeRole, switchRole, isAdmin: userIsAdmin } = useAuth();
  const [currentRole, setCurrentRole] = useState<'agent' | 'admin'>(activeRole === 'admin' ? 'admin' : 'agent');

  const handleRoleSwitch = (role: 'agent' | 'admin') => {
    setCurrentRole(role);
    if (onSwitchRole) {
      onSwitchRole(role);
    } else {
      // Use the switchRole function from useAuth
      switchRole(role);
    }
  };

  // Only show portal switcher if user has admin privileges
  const showPortalSwitcher = userIsAdmin;

  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-[#1A1F2C] px-4 ${className}`}>
      {/* Fixed the SidebarTrigger implementation to not expect asChild behavior */}
      <SidebarTrigger className="text-white" />

      <div className="flex-1">
        <PageBreadcrumb />
      </div>

      <div className="flex items-center gap-4">
        {showPortalSwitcher ? (
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
              >
                Agent Portal
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`capitalize ${currentRole === 'admin' ? 'bg-purple-900/30 text-purple-300' : ''}`}
                onClick={() => handleRoleSwitch('admin')}
              >
                Admin Portal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="h-8 px-3 py-1 text-sm text-gray-200">
            <span className="capitalize">Agent Portal</span>
          </div>
        )}

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
