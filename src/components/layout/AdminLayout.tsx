
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
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
import { TeamSwitcher } from './TeamSwitcher';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  // Redirect to login if not authenticated or not an admin
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-full w-full bg-background text-foreground font-mono">
      <SidebarProvider>
        <AdminSidebar />
        
        {/* Main content */}
        <div className="flex flex-col h-full p-4 w-full">
          <div className="flex flex-col h-full rounded-xl border border-muted/60 overflow-hidden shadow-sm">
            {/* Fixed header */}
            <header className="h-14 flex-shrink-0 border-b border-border/20 flex items-center justify-between px-4 bg-card">
              <div className="flex items-center space-x-3">
                <SidebarTrigger className="mr-2" />
                <h1 className="text-lg font-normal ml-2">PropertyPro <span className="text-accent font-semibold">Admin</span></h1>
                <TeamSwitcher />
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
                    <DropdownMenuItem onClick={() => window.location.href = '/admin/settings'}>Admin Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/admin/system'}>System Configuration</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            
            {/* Main scrollable content - Improved with consistent minimum height */}
            <main className="flex-1 min-h-[calc(100vh-3.5rem-2rem)] overflow-y-auto bg-background p-6">
              <div className="content-container">
                {children || <Outlet />}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default AdminLayout;
