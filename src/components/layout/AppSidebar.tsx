
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Shield, ChevronsUpDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NavMain } from './sidebar/NavMain';
import { NavAnalytics } from './sidebar/NavAnalytics';
import { NavPreferences } from './sidebar/NavPreferences';
import { SidebarProfile } from './sidebar/SidebarProfile';

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user, switchRole, isAdmin } = useAuth();
  
  return (
    <>
      <Sidebar 
        className="border-none bg-[#0F0E11] transition-all duration-300 ease-in-out" 
        collapsible="icon" 
        side="left" 
        variant="sidebar"
      >
        <SidebarHeader>
          {isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-3 w-full text-left hover:text-primary transition-colors focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                    <span className="font-bold text-sm">P</span>
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 text-lg font-semibold">PropertyPro</span>
                      <ChevronsUpDown className="h-4 w-4 opacity-60 ml-auto" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="start" className="w-[180px] bg-popover">
                <DropdownMenuItem 
                  onClick={() => switchRole('agent')}
                  className="flex items-center cursor-pointer bg-accent/10"
                >
                  <Building className="h-4 w-4 mr-2" />
                  <span>Agent Portal</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => switchRole('admin')}
                  className="flex items-center cursor-pointer"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Admin Portal</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center px-2 py-3">
              <Link to="/dashboard" className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white">
                  <span className="font-bold text-sm">P</span>
                </div>
                {!isCollapsed && (
                  <span className="ml-2 text-lg font-semibold transition-opacity">PropertyPro</span>
                )}
              </Link>
            </div>
          )}
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
