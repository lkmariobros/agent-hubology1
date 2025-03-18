
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className={cn("hidden md:block", sidebarCollapsed ? "w-20" : "w-64")}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden"
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
            <h1 className="text-lg font-semibold ml-2">Property Agency System</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-sm font-medium text-accent">JS</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
