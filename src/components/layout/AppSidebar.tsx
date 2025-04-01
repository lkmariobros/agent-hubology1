
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { NavigationSidebar } from './NavigationSidebar';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { isAdmin } = useAuth();
  
  return (
    <Sidebar className="border-none bg-[#1A1F2C] AppSidebar">
      <SidebarContent className="p-0">
        <NavigationSidebar />
      </SidebarContent>
    </Sidebar>
  );
}

// Add this export for backward compatibility
export { AppSidebar as AdminSidebar };
