
import React from 'react';
import { useAuth } from '@/context/AuthContext';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
    <Sidebar className="border-none bg-[#1F232D] AdminSidebar">
      <SidebarHeader>
        {/* Use the consistent PortalSwitcher component */}
        <PortalSwitcher showLabel={true} className="px-2 py-3 w-full" />
      </SidebarHeader>
      
      <SidebarContent>
        <NavAdmin />
        <NavReports />
        <NavSystem />
      </SidebarContent>
      
      <SidebarFooter>
        <AdminProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
