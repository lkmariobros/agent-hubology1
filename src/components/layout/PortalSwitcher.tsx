
import React from 'react';
import { Toggle } from "@/components/ui/toggle";
import { Button } from '@/components/ui/button';
import { Building, Shield, SwitchCamera } from 'lucide-react';
import { useAuth, UserRole } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function PortalSwitcher() {
  const { user, switchRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Only show this component for users with admin privileges
  if (!user || !isAdmin) return null;
  
  const currentRole = user.activeRole;
  const isAdminActive = currentRole === 'admin';

  const handleRoleSwitch = () => {
    // Toggle to the other role
    const newRole: UserRole = isAdminActive ? 'agent' : 'admin';
    switchRole(newRole);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRoleSwitch}
      className="ml-2 rounded-full hover:bg-accent/10 focus:outline-none focus:ring-0"
      title={isAdminActive ? "Switch to Agent Portal" : "Switch to Admin Portal"}
    >
      <SwitchCamera className="h-4 w-4" />
    </Button>
  );
}
