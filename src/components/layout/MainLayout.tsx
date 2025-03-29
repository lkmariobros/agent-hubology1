import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import NavUtilities from './sidebar/NavUtilities';
import PageBreadcrumb from './PageBreadcrumb';
interface MainLayoutProps {
  children?: React.ReactNode;
}

// Create a header component that has access to the sidebar context
const Header = () => {
  const {
    open,
    toggleSidebar
  } = useSidebar();
  return <div>
      {/* Breadcrumb and Navigation Section */}
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 mr-2 z-20" aria-label={open ? "Collapse sidebar" : "Expand sidebar"}>
            {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
          <PageBreadcrumb />
        </div>
        
        {/* Utilities section */}
        <NavUtilities />
      </div>
      
      {/* Divider */}
      <div className="border-b border-border"></div>
    </div>;
};

const MainLayout: React.FC<MainLayoutProps> = ({
  children
}) => {
  // Load saved sidebar state from localStorage if available
  const savedState = localStorage.getItem("sidebar:state") === "false" ? false : true;
  const location = useLocation();

  // Add data-route attribute to body
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);

    // Set document title based on location
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      const title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
      document.title = isNaN(Number(title)) ? title : `${pathSegments[pathSegments.length - 2]} Details`;
    } else {
      document.title = "Dashboard";
    }
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [location.pathname]);

  // Set up effect to save sidebar state changes
  React.useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === "sidebar:state") {
        // This ensures our UI stays in sync with other tabs
        console.log("Sidebar state changed:", e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return <SidebarProvider defaultOpen={savedState}>
      <div className="flex min-h-screen w-full bg-background app-container">
        <AppSidebar />
        <div className="flex-1 overflow-auto main-content content-area dashboard-container">
          <Header />
          <div className="p-6 content-area">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>;
};
export default MainLayout;
