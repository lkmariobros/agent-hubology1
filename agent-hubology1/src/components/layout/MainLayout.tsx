
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import EnhancedHeader from './EnhancedHeader';

interface MainLayoutProps {
  children?: React.ReactNode;
}



const MainLayout: React.FC<MainLayoutProps> = ({
  children
}) => {
  // Load saved sidebar state from localStorage if available
  const savedStateStr = localStorage.getItem("sidebar:state");
  const savedState = savedStateStr === "collapsed" ? "collapsed" : "expanded";
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

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

  // Handle role switching
  const handleRoleSwitch = (role: 'agent' | 'admin') => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <SidebarProvider defaultState={savedState} onStateChange={handleStateChange}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden bg-[#161920]">
          <EnhancedHeader isAdmin={isAdminRoute} onSwitchRole={handleRoleSwitch} />
          <div className="px-[44px] py-[36px]">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
