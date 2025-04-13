
import React from 'react';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
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
  const { isAdmin } = useClerkAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
    <>
      <Sidebar className="border-none bg-[#1A1F2C]">
        <SidebarHeader className={`border-none ${collapsed ? 'px-0 flex justify-center' : 'px-5'} py-4`}>
          <PortalSwitcher showLabel={!collapsed} className={collapsed ? "flex justify-center" : "w-full"} />
        </SidebarHeader>
        
        <SidebarContent className={`${collapsed ? 'px-0 flex flex-col items-center' : 'px-3'} py-4 overflow-y-visible space-y-6`}>
          <NavMain />
          <NavAnalytics />
          <NavPreferences />
        </SidebarContent>
        
        <SidebarFooter className={`border-t border-white/5 ${collapsed ? 'px-0 flex justify-center' : 'px-5'} py-3`}>
          <SidebarProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
