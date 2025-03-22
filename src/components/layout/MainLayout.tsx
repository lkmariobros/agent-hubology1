
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import NavUtilities from './sidebar/NavUtilities';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-between px-6 py-3 border-b">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <NavUtilities />
          </div>
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
