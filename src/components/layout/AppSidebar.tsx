
import React from 'react';
import { Link } from 'react-router-dom';

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
  
  return (
    <>
      <Sidebar 
        className="border-none bg-[#0F0E11] transition-all duration-300 ease-in-out" 
        collapsible="icon" 
        side="left" 
        variant="sidebar"
      >
        <SidebarHeader className="flex flex-col gap-4">
          <div className="flex items-center px-2 py-3">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-white">
                <span className="font-bold text-sm">P</span>
              </div>
              {!isCollapsed && (
                <span className="ml-2 text-lg font-semibold transition-opacity">PropertyPro</span>
              )}
            </Link>
          </div>
          <PortalSwitcher />
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
