import React from 'react';
import { useAuth } from '@/context/AuthContext';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavMain } from './sidebar/NavMain';
import { NavAnalytics } from './sidebar/NavAnalytics';
import { NavPreferences } from './sidebar/NavPreferences';
import { SidebarProfile } from './sidebar/SidebarProfile';
import { PortalSwitcher } from './PortalSwitcher';

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { isAdmin } = useAuth();
  
  console.log('AppSidebar rendering with isAdmin:', isAdmin);
  
  return (
    <>
      <Sidebar 
        className="border-none bg-[#0F0E11] transition-all duration-300 ease-in-out" 
        collapsible="icon" 
        side="left" 
        variant="sidebar"
      >
        <SidebarHeader>
          {/* Always use PortalSwitcher whether admin or not, but it will only show the dropdown for admins */}
          <PortalSwitcher showLabel={!isCollapsed} className="px-2 py-3" />
        </SidebarHeader>
        
        <SidebarContent>
          <NavMain collapsed={isCollapsed} />
          <NavAnalytics collapsed={isCollapsed} />
          <NavPreferences collapsed={isCollapsed} />
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarProfile collapsed={isCollapsed} />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail className="group-hover:after:bg-accent-foreground/10" />
    </>
  );
}
