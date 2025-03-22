
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Shield, ChevronDown } from 'lucide-react';
import { useAuth, UserRole } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function PortalSwitcher() {
  const { user, switchRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Only show this component for users with admin privileges
  if (!user || !isAdmin) return null;
  
  const currentRole = user.activeRole;

  const handleRoleSwitch = () => {
    // Toggle to the other role
    const newRole: UserRole = currentRole === 'admin' ? 'agent' : 'admin';
    switchRole(newRole);
  };

  // Determine icon and label based on current role
  const icon = currentRole === 'admin' ? 
    <Shield className="h-4 w-4 mr-1" /> : 
    <Building className="h-4 w-4 mr-1" />;
  
  const label = currentRole === 'admin' ? 'Admin Portal' : 'Agent Portal';

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleRoleSwitch}
      className="flex items-center text-sm font-medium hover:bg-accent/10"
    >
      {icon}
      {label}
      <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
    </Button>
  );
}
