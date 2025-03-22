
import React from 'react';
import { Outlet } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import NavUtilities from './sidebar/NavUtilities';

interface MainLayoutProps {
  children?: React.ReactNode;
}

// Create a header component that has access to the sidebar context
const Header = () => {
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="h-8 w-8 mr-2 z-20"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <NavUtilities />
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
