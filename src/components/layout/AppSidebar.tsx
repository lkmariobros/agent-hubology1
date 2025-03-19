
import React from 'react';
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavMain } from './sidebar/NavMain';
import { NavAnalytics } from './sidebar/NavAnalytics';
import { NavPreferences } from './sidebar/NavPreferences';
import { SidebarProfile } from './sidebar/SidebarProfile';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center px-2 py-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-white">
            <span className="font-bold text-sm">P</span>
          </div>
          <span className="ml-2 text-lg font-semibold">PropertyPro</span>
        </Link>
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
  );
}
