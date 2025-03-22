
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
    <div className="flex items-center justify-between px-6 py-3 border-b border-[rgba(255,255,255,0.06)] bg-dark-background">
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

  // Force dark mode on component mount but prevent multiple applications
  React.useEffect(() => {
    // Force dark mode application
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    }
    
    if (!document.body.classList.contains('dark-applied')) {
      document.body.classList.add('dark-applied');
      
      // Apply InnovaCraft dark mode styles with proper contrast
      document.body.style.setProperty('--background', '#161920');       // InnovaCraft content background
      document.body.style.setProperty('--card', '#1E2128');             // InnovaCraft card background
      document.body.style.setProperty('--sidebar-background', '#1F232D'); // InnovaCraft sidebar background
      document.body.style.setProperty('--foreground', '#f8f9fa');
      document.body.style.setProperty('--card-foreground', '#f8f9fa');
      document.body.style.setProperty('--sidebar-foreground', '#f8f9fa');
      document.body.style.setProperty('--muted-foreground', '#a1a1aa');
      document.body.style.setProperty('--border', 'rgba(255, 255, 255, 0.06)');
      document.body.style.setProperty('--input', '#252830');
      document.body.style.setProperty('--ring', '#3e4251');
      
      console.log("MainLayout mounted - forcing InnovaCraft dark mode styling");
    }
    
    return () => {
      // Don't remove dark mode on unmount to avoid flashing
    };
  }, []);

  // Set up effect to save sidebar state changes
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sidebar:state") {
        console.log("Sidebar state changed:", e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return (
    <SidebarProvider defaultOpen={savedState}>
      <div className="flex h-screen overflow-hidden w-full app-container">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-dark-background content-area">
          <Header />
          <div className="flex-1 overflow-auto p-6 bg-dark-background">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
