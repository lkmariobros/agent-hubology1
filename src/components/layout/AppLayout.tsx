
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

const AppLayout: React.FC = () => {
  // Load saved sidebar state from localStorage if available
  const savedStateStr = localStorage.getItem("sidebar:state");
  const savedState = savedStateStr === "collapsed" ? "collapsed" : "expanded";
  const navigate = useNavigate();
  
  // Handle state change to save to localStorage
  const handleStateChange = (newState: "expanded" | "collapsed") => {
    localStorage.setItem("sidebar:state", newState);
  };

  // Simple authentication check
  React.useEffect(() => {
    // For demo purposes, we'll assume user is logged in
    // In a real app, you would check for session/token
    const isLoggedIn = true; // Replace with actual auth check
    
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  return (
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
  );
};

export default AppLayout;
