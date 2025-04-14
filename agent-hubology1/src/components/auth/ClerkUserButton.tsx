import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/auth';

interface ClerkUserButtonProps {
  afterSignOutUrl?: string;
}

const ClerkUserButton: React.FC<ClerkUserButtonProps> = ({ 
  afterSignOutUrl = '/' 
}) => {
  const { profile, roles, activeRole, switchRole } = useClerkAuth();

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <div className="flex items-center gap-2">
      {roles.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="capitalize">
              {activeRole} Portal
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Portal</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((role) => (
              <DropdownMenuItem
                key={role}
                className="capitalize"
                onClick={() => handleRoleSwitch(role)}
              >
                {role} Portal
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <UserButton 
        afterSignOutUrl={afterSignOutUrl}
        userProfileMode="navigation"
        userProfileUrl="/profile"
        appearance={{
          elements: {
            userButtonAvatarBox: "w-8 h-8",
          }
        }}
      />
    </div>
  );
};

export default ClerkUserButton;
