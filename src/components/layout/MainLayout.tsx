
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, useSidebar, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import NavUtilities from './sidebar/NavUtilities';
import PageBreadcrumb from './PageBreadcrumb';
import Container from '../ui/container';
import { NotificationProvider } from '@/context/NotificationContext';

interface MainLayoutProps {
  children?: React.ReactNode;
}

// Create a header component that has access to the sidebar context
const Header = () => {
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <div className="sticky top-0 z-10 bg-[#161920] border-b border-border/10">
      {/* Breadcrumb and Navigation Section */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="h-8 w-8 mr-1 text-muted-foreground hover:text-foreground" 
            aria-label="Toggle sidebar"
          >
            {state === "expanded" ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <PageBreadcrumb />
        </div>
        
        {/* Utilities section */}
        <NavUtilities />
      </div>
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({
  children
}) => {
  // Load saved sidebar state from localStorage if available
  const savedStateStr = localStorage.getItem("sidebar:state");
  const savedState = savedStateStr === "collapsed" ? "collapsed" : "expanded";
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
  const handleStateChange = (newState: "expanded" | "collapsed") => {
    localStorage.setItem("sidebar:state", newState);
  };
  
  return (
    <SidebarProvider defaultState={savedState} onStateChange={handleStateChange}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden bg-[#161920]">
          <Header />
          <Container className="py-6">
            {children || <Outlet />}
          </Container>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
