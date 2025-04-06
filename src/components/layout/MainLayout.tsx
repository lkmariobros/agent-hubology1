
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import NavUtilities from './sidebar/NavUtilities';
import AuthStateHandler from '@/components/ui/auth-state-handler';

const MainLayout: React.FC = () => {
  // Load saved sidebar state from localStorage if available
  const savedStateStr = localStorage.getItem("sidebar:state");
  const savedState = savedStateStr === "collapsed" ? "collapsed" : "expanded";
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  
  // Handle state change to save to localStorage
  const handleStateChange = (newState: "expanded" | "collapsed") => {
    localStorage.setItem("sidebar:state", newState);
  };

  // Simple authentication check
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthStateHandler>
      <SidebarProvider defaultState={savedState} onStateChange={handleStateChange}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-x-hidden bg-[#161920]">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthStateHandler>
  );
};

export default MainLayout;
