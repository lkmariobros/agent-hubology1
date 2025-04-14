
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ChevronRight, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export function AdminProfile() {
  const { user, signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  
  if (!user) return null;
  
  // Extract initials from email
  const getInitials = () => {
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'A';
  };
  
  // Get display name from email or name field
  const displayName = user.name || (user.email ? user.email.split('@')[0] : 'Admin');
  
  // Display the active role
  const roleDisplay = 'Administrator';
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };
  
  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center">
            <Avatar className="h-7 w-7">
              <AvatarImage src={`https://i.pravatar.cc/300?u=${user.id}`} alt={displayName} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="flex items-center p-2">
            <div className="ml-2 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/admin/profile" className="flex items-center cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center w-full rounded-lg p-2 text-left bg-transparent hover:bg-secondary/50 transition-colors">
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
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="flex items-center p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://i.pravatar.cc/300?u=${user.id}`} alt={displayName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin/profile" className="flex items-center cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
