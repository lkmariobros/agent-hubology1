
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, User, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar for desktop */}
      <div className={cn(
        "hidden md:block transition-all duration-300 ease-in-out", 
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>
      
      {/* Mobile sidebar as overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border">
            <Sidebar collapsed={false} />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed header */}
        <header className="h-16 flex-shrink-0 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h1 className="text-lg font-semibold ml-2">PropertyPro</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <BellRing className="h-5 w-5" />
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
        
        {/* Scrollable main content - use native overflow instead of ScrollArea for better performance */}
        <div className="flex-1 overflow-y-auto">
          <main className="h-full">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
