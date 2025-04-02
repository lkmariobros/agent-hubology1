
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
      <Sidebar className="border-none bg-[#1A1F2C]">
        <SidebarHeader className="border-none px-5 py-4">
          {/* Use the consistent PortalSwitcher component */}
          <PortalSwitcher showLabel={true} className="w-full" />
        </SidebarHeader>
        
        <SidebarContent className="px-3 py-2 overflow-y-visible">
          <NavAdmin />
          <NavReports />
          <NavSystem />
        </SidebarContent>
        
        <SidebarFooter className="border-t border-white/5 px-5 py-3">
          <AdminProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
