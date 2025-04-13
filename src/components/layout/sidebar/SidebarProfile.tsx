
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
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
import { UserButton } from '@clerk/clerk-react';

export function SidebarProfile() {
  const { user, profile, signOut, activeRole } = useClerkAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  
  if (!user) return null;
  
  // Extract initials from name or email
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    } else if (user.primaryEmailAddress) {
      return user.primaryEmailAddress.emailAddress.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  // Get display name
  const displayName = user.fullName || user.firstName || 
    (user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress.split('@')[0] : 'User');
  
  // Get email
  const email = user.primaryEmailAddress?.emailAddress || '';
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };
  
  if (collapsed) {
    return (
      <div className="flex items-center justify-center">
        <UserButton 
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonAvatarBox: "h-7 w-7",
            }
          }}
        />
      </div>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center w-full rounded-lg p-2 text-left bg-transparent hover:bg-secondary/50 transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.imageUrl} alt={displayName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {activeRole}
            </p>
          </div>
          <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="flex items-center p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.imageUrl} alt={displayName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center cursor-pointer">
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
