
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

interface SidebarProfileProps {
  collapsed?: boolean;
}

export function SidebarProfile({ collapsed }: SidebarProfileProps) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <Link 
      to="/profile" 
      className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
    >
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground">
        <span className="font-medium text-sm">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </span>
      </div>
      
      {!collapsed && (
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium">{user.firstName} {user.lastName}</span>
          <span className="text-xs text-muted-foreground truncate">{user.role || 'Agent'}</span>
        </div>
      )}
    </Link>
  );
}
