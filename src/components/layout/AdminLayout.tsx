
import React from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { BellRing } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/providers/AuthProvider';

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from '@/components/ui/button';
import { AdminSidebar } from './AdminSidebar';
import { ThemeToggle } from '../theme/ThemeToggle';

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Redirect to agent dashboard if not an admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-full w-full bg-dark-background text-foreground font-mono app-container">
      <SidebarProvider>
        <AdminSidebar />
        
        {/* Main content */}
        <div className="flex flex-col h-full w-full content-area">
          {/* Fixed header */}
          <header className="h-14 flex-shrink-0 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-4 bg-dark-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
              {/* Removed Portal Switcher from here */}
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <BellRing className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent text-sm font-medium">
                        {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name || 'Admin'}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/admin/settings" className="w-full">Admin Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/admin/system" className="w-full">System Configuration</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto bg-dark-background">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default AdminLayout;
