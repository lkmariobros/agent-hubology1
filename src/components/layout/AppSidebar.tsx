
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/components/ui/sidebar';

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
  const { state } = useSidebar();
  const collapsed = state === "icon";
  
  return (
    <>
      <Sidebar className="border-none bg-[#1A1F2C]">
        <SidebarHeader className="border-none px-5 py-4">
          <PortalSwitcher showLabel={!collapsed} className="w-full" />
        </SidebarHeader>
        
        <SidebarContent className="px-3 py-2">
          <NavMain collapsed={collapsed} />
          <NavAnalytics collapsed={collapsed} />
          <NavPreferences collapsed={collapsed} />
        </SidebarContent>
        
        <SidebarFooter className="border-t border-white/5 px-5 py-3">
          <SidebarProfile collapsed={collapsed} />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
