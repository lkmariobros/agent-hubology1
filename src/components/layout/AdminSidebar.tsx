
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavAdmin } from './sidebar/NavAdmin';
import { NavReports } from './sidebar/NavReports';
import { NavSystem } from './sidebar/NavSystem';
import { AdminProfile } from './sidebar/AdminProfile';
import { PortalSwitcher } from './PortalSwitcher';

export function AdminSidebar() {
  const { isAdmin } = useAuth();
  const { open } = useSidebar();
  
  if (!isAdmin) {
    return null; // Hide sidebar completely if not admin
  }

  return (
    <>
      <Sidebar 
        className="border-none bg-[#1A1F2C]" 
        collapsible="icon" // Use icon mode for collapsible
      >
        <SidebarHeader className={`border-none ${open ? 'px-5' : 'px-0'} py-4`}>
          {/* Use the consistent PortalSwitcher component */}
          <PortalSwitcher showLabel={open} className={open ? "w-full" : "w-auto"} />
        </SidebarHeader>
        
        <SidebarContent className={`${open ? 'px-3' : 'px-1'} py-2 overflow-y-visible`}>
          <NavAdmin />
          <NavReports />
          <NavSystem />
        </SidebarContent>
        
        <SidebarFooter className={`border-t border-white/5 ${open ? 'px-5' : 'px-2'} py-3`}>
          <AdminProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
