
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

import { NavMain } from './sidebar/NavMain';
import { NavAnalytics } from './sidebar/NavAnalytics';
import { NavPreferences } from './sidebar/NavPreferences';
import { SidebarProfile } from './sidebar/SidebarProfile';
import { PortalSwitcher } from './PortalSwitcher';

export function AppSidebar() {
  const { isAdmin } = useAuth();
  
  return (
    <>
      <Sidebar className="border-none bg-[#1A1F2C]">
        <SidebarHeader className="border-none px-5 py-4">
          <PortalSwitcher showLabel={true} className="w-full" />
        </SidebarHeader>
        
        <SidebarContent className="px-3 py-2">
          <NavMain />
          <NavAnalytics />
          <NavPreferences />
        </SidebarContent>
        
        <SidebarFooter className="border-t border-white/5 px-5 py-3">
          <SidebarProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
