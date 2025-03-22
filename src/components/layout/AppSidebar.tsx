
import React from 'react';
import { Link } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <>
      <Sidebar 
        className="border-none bg-[#0F0E11]" 
        collapsible="icon" 
        side="left" 
        variant="sidebar"
      >
        <SidebarHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2 py-3">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-white">
                <span className="font-bold text-sm">P</span>
              </div>
              <span className="ml-2 text-lg font-semibold">PropertyPro</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="h-8 w-8"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
          </div>
          <PortalSwitcher />
        </SidebarHeader>
        
        <SidebarContent>
          <NavMain />
          <NavAnalytics />
          <NavPreferences />
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
