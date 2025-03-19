
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarWrapper,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // Read the sidebar state from localStorage on initial render
  const getInitialSidebarState = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar:state');
      return savedState ? savedState === 'expanded' : true;
    }
    return true;
  };

  const handleSidebarChange = (open: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar:state', open ? 'expanded' : 'collapsed');
    }
  };

  return (
    <SidebarWrapper 
      defaultOpen={getInitialSidebarState()}
      onOpenChange={handleSidebarChange}
      className="min-h-screen w-full"
      style={{
        '--sidebar-width': '16rem',
        '--sidebar-width-icon': '4rem',
      } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">PropertyPro</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </SidebarInset>
    </SidebarWrapper>
  );
};

export default MainLayout;
