
import React from 'react';
import { Outlet } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import NavUtilities from './sidebar/NavUtilities';
import { PortalSwitcher } from './PortalSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import { ThemeToggle } from '../theme/ThemeToggle';

interface MainLayoutProps {
  children?: React.ReactNode;
}

// Create a header component that has access to the sidebar context
const Header = () => {
  const { open, toggleSidebar } = useSidebar();
  const { isAdmin } = useAuth();
  
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border/20 bg-background">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="h-8 w-8 mr-2 z-20" 
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
        
        {/* Only render PortalSwitcher for users with admin privileges */}
        {isAdmin && <PortalSwitcher />}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NavUtilities />
      </div>
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Load saved sidebar state from localStorage if available
  const savedState = localStorage.getItem("sidebar:state") === "false" ? false : true;

  // Force dark mode on component mount
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.setProperty('--background', '#161920');
    document.body.style.setProperty('--card', '#1e2028');
    document.body.style.setProperty('--sidebar-background', '#1f2128');
    console.log("MainLayout mounted - forcing dark mode");
  }, []);

  // Set up effect to save sidebar state changes
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sidebar:state") {
        // This ensures our UI stays in sync with other tabs
        console.log("Sidebar state changed:", e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return (
    <SidebarProvider defaultOpen={savedState}>
      <div className="flex h-screen overflow-hidden w-full bg-dark-background dark:bg-dark-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden dark:bg-dark-background" style={{backgroundColor: '#161920'}}>
          <Header />
          <div className="flex-1 overflow-auto p-6 dark:bg-dark-background" style={{backgroundColor: '#161920'}}>
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
