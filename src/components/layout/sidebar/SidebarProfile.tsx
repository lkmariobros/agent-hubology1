
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

interface SidebarProfileProps {
  collapsed?: boolean;
}

export function SidebarProfile({ collapsed }: SidebarProfileProps) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Extract first and last initials from the name or email
  const getInitials = () => {
    if (user.name) {
      // Try to get initials from name
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`;
      }
      return user.name[0];
    }
    // Fallback to email initial
    return user.email[0];
  };
  
  return (
    <Link 
      to="/profile" 
      className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
    >
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground">
        <span className="font-medium text-sm">
          {getInitials()}
        </span>
      </div>
      
      {!collapsed && (
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium">{user.name || user.email.split('@')[0]}</span>
          <span className="text-xs text-muted-foreground truncate">{user.activeRole}</span>
        </div>
      )}
    </Link>
  );
}
