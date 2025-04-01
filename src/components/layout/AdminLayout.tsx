
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { BellRing } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

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
  const { user, loading, signOut, isAdmin } = useAuth();
  const location = useLocation();
  
  // Add data-route attribute to body
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);
    
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [location.pathname]);
  
  // If still loading, show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if user has admin role
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-full w-full bg-background text-foreground font-mono app-container AdminLayout-container">
      <SidebarProvider>
        <AdminSidebar />
        
        {/* Main content */}
        <div className="flex flex-col h-full w-full main-content">
          {/* Fixed header */}
          <header className="h-14 flex-shrink-0 border-b border-border flex items-center justify-between px-4 bg-sidebar-bg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
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
                        {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name || user?.email?.split('@')[0] || 'Admin'}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/admin/settings'}>Admin Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/admin/system'}>System Configuration</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto bg-background content-area">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default AdminLayout;
