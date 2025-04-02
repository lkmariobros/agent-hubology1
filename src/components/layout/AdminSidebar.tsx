
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { NavAdmin } from './sidebar/NavAdmin';
import { NavReports } from './sidebar/NavReports';
import { NavSystem } from './sidebar/NavSystem';
import { AdminProfile } from './sidebar/AdminProfile';
import { PortalSwitcher } from './PortalSwitcher';

export function AdminSidebar() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return null; // Hide sidebar completely if not admin
  }

  return (
    <>
      <Sidebar className="border-none bg-[#1F232D]">
        <SidebarHeader className="border-b border-white/5">
          {/* Use the consistent PortalSwitcher component */}
          <PortalSwitcher showLabel={true} className="px-3 py-4 w-full" />
        </SidebarHeader>
        
        <SidebarContent className="py-4">
          <NavAdmin />
          <NavReports />
          <NavSystem />
        </SidebarContent>
        
        <SidebarFooter className="border-t border-white/5 py-3">
          <AdminProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
