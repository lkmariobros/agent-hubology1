
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, ChevronLeft } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import NavUtilities from './sidebar/NavUtilities';
import PageBreadcrumb from './PageBreadcrumb';

// Create a header component that has access to the sidebar context
const Header = () => {
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <div className="sticky top-0 z-10 bg-[#161920]">
      {/* Breadcrumb and Navigation Section */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="h-8 w-8 mr-1" 
            aria-label="Toggle sidebar"
          >
            {state === "expanded" ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : state === "icon" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <PageBreadcrumb />
        </div>
        
        {/* Utilities section */}
        <NavUtilities />
      </div>
      
      {/* Divider */}
      <div className="border-b border-border"></div>
    </div>
  );
};

const AdminLayout = () => {
  // Load saved sidebar state from localStorage if available
  const savedStateStr = localStorage.getItem("admin-sidebar:state");
  const savedState = savedStateStr === "icon" ? "icon" : 
                    savedStateStr === "collapsed" ? "collapsed" : "expanded";
  const location = useLocation();

  // Add data-route attribute to body
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);

    // Set document title based on location
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      const title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
      document.title = isNaN(Number(title)) ? `Admin - ${title}` : `Admin - ${pathSegments[pathSegments.length - 2]} Details`;
    } else {
      document.title = "Admin Dashboard";
    }
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [location.pathname]);

  // Set up effect to save sidebar state changes
  const handleStateChange = (newState) => {
    localStorage.setItem("admin-sidebar:state", newState);
  };

  return (
    <SidebarProvider defaultState={savedState} onStateChange={handleStateChange}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden bg-[#161920]">
          <Header />
          <div className="px-[44px] py-[36px]">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
