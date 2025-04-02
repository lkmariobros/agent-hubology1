
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from '@/components/ui/sidebar';

export function SidebarProfile() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "icon";
  
  if (!user) return null;
  
  // Extract initials from email
  const getInitials = () => {
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  // Get display name from email or name field
  const displayName = user.name || (user.email ? user.email.split('@')[0] : 'User');
  
  // Display the active role
  const roleDisplay = user.activeRole;
  
  if (collapsed) {
    return (
      <Link 
        to="/profile" 
        className="flex items-center justify-center"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={`https://i.pravatar.cc/300?u=${user.id}`} alt={displayName} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </Link>
    );
  }
  
  return (
    <Link 
      to="/profile" 
      className="flex items-center w-full rounded-lg p-2 text-left bg-transparent hover:bg-secondary/50 transition-colors"
    >
      <Avatar className="h-7 w-7">
        <AvatarImage src={`https://i.pravatar.cc/300?u=${user.id}`} alt={displayName} />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      
      <div className="ml-2 flex-1 min-w-0">
        <p className="text-sm font-medium text-sidebar-foreground truncate">
          {displayName}
        </p>
        <p className="text-xs text-sidebar-foreground/60 truncate">
          {roleDisplay}
        </p>
      </div>
      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
    </Link>
  );
}
