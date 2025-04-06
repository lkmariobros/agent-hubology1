
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { NotificationProvider } from '@/context/NotificationContext';

const AppLayout: React.FC = () => {
  // Load saved sidebar state from localStorage if available
  const savedStateStr = localStorage.getItem("sidebar:state");
  const savedState = savedStateStr === "collapsed" ? "collapsed" : "expanded";
  
  // Handle state change to save to localStorage
  const handleStateChange = (newState: "expanded" | "collapsed") => {
    localStorage.setItem("sidebar:state", newState);
  };

  return (
    <SidebarProvider defaultState={savedState} onStateChange={handleStateChange}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden bg-[#161920]">
          <div className="px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
