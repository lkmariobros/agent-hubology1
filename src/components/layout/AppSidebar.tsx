
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

import { NavMain } from './sidebar/NavMain';
import { NavAnalytics } from './sidebar/NavAnalytics';
import { NavPreferences } from './sidebar/NavPreferences';
import { SidebarProfile } from './sidebar/SidebarProfile';
import { PortalSwitcher } from './PortalSwitcher';

export function AppSidebar() {
  const { isAdmin } = useAuth();
  const { isExpanded } = useSidebar();
  
  return (
    <>
      <Sidebar 
        className="border-none bg-[#1A1F2C]"
        collapsible="icon" // Use icon mode for collapsible
      >
        <SidebarHeader className={`border-none ${isExpanded ? 'px-5' : 'px-0'} py-4`}>
          <PortalSwitcher showLabel={isExpanded} className={isExpanded ? "w-full" : "w-auto"} />
        </SidebarHeader>
        
        <SidebarContent className={`${isExpanded ? 'px-3' : 'px-1'} py-2`}>
          <NavMain />
          <NavAnalytics />
          <NavPreferences />
        </SidebarContent>
        
        <SidebarFooter className={`border-t border-white/5 ${isExpanded ? 'px-5' : 'px-2'} py-3`}>
          <SidebarProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
