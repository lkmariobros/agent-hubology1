import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { NavigationSidebar } from './NavigationSidebar';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { PortalSwitcher } from './PortalSwitcher';

// Rename the component to AppSidebar and export it
export function AppSidebar() {
  const { isAdmin } = useAuth();
  
  return (
    <Sidebar className="border-none bg-[#1F232D] AppSidebar">
      <SidebarHeader>
        {/* Use the consistent PortalSwitcher component */}
        <PortalSwitcher showLabel={true} className="px-2 py-3 w-full" />
      </SidebarHeader>
      
      <SidebarContent>
        <NavigationSidebar />
      </SidebarContent>
      
      <SidebarFooter>
        {/* Footer content */}
      </SidebarFooter>
    </Sidebar>
  );
}

// Add this export for backward compatibility
export { AppSidebar as AdminSidebar };
