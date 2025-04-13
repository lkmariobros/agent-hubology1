import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import Container from '../ui/container';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import AdminAccessDebugger from '../admin/AdminAccessDebugger';
import EnhancedHeader from './EnhancedHeader';



const AdminLayout = () => {
  // Load saved sidebar state from localStorage if available
  const savedStateStr = localStorage.getItem("admin-sidebar:state");
  const savedState = savedStateStr === "collapsed" ? "collapsed" : "expanded";
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, user, activeRole } = useClerkAuth();

  // Check for admin access directly from Clerk
  const canAccessAdmin = isAdmin;

  // Add data-route attribute to body
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);
    console.log('[AdminLayout] Rendering with admin access:', canAccessAdmin);

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
  }, [location.pathname, canAccessAdmin]);

  // Set up effect to save sidebar state changes
  const handleStateChange = (newState: "expanded" | "collapsed") => {
    localStorage.setItem("admin-sidebar:state", newState);
  };

  // Handle role switching
  const handleRoleSwitch = (role: 'agent' | 'admin') => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // Check if user has admin access
  if (!canAccessAdmin) {
    console.log('[AdminLayout] No admin access, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SidebarProvider defaultState={savedState} onStateChange={handleStateChange}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden bg-[#161920]">
          <EnhancedHeader isAdmin={true} onSwitchRole={handleRoleSwitch} />
          <Container className="py-6">
            <Outlet />
          </Container>
        </main>
        <AdminAccessDebugger />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
