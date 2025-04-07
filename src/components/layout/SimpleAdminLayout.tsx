import React, { ReactNode } from 'react';
import SimpleHeader from './SimpleHeader';
import SimpleProtectedRoute from '../auth/SimpleProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar';
import SimpleAdminSidebar from './SimpleAdminSidebar';

interface SimpleAdminLayoutProps {
  children: ReactNode;
}

const SimpleAdminLayout: React.FC<SimpleAdminLayoutProps> = ({ children }) => {
  // Get saved sidebar state from localStorage
  const savedState = localStorage.getItem("admin-sidebar:state") as "expanded" | "collapsed" || "expanded";

  // Set up effect to save sidebar state changes
  const handleStateChange = (newState: "expanded" | "collapsed") => {
    localStorage.setItem("admin-sidebar:state", newState);
  };

  return (
    <SimpleProtectedRoute>
      <SidebarProvider defaultState={savedState} onStateChange={handleStateChange}>
        <div className="flex min-h-screen w-full">
          <SimpleAdminSidebar />
          <main className="flex-1 overflow-x-hidden bg-[#161920]">
            <SimpleHeader />
            <div className="px-[44px] py-[36px]">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </SimpleProtectedRoute>
  );
};

export default SimpleAdminLayout;
