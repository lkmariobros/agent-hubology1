
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Shield, ChevronsUpDown } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
  const { user, switchRole } = useAuth();
  const currentRole = user?.activeRole;
  const isAgentActive = currentRole === 'agent';

  return (
    <Sidebar className="border-none">
      <SidebarHeader>
        {/* Portal Switcher integrated in the sidebar header */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-3 w-full text-left hover:text-white transition-colors focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <span className="font-bold text-sm">P</span>
              </div>
              <span className="ml-2 text-lg font-semibold">PropertyPro</span>
              <ChevronsUpDown className="h-4 w-4 opacity-60 ml-auto" />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="start" className="w-[180px] bg-[#232328] border-[#3a3a40] text-[#f5f5f7]">
            <DropdownMenuItem 
              onClick={() => switchRole('agent')}
              className={`flex items-center cursor-pointer ${isAgentActive ? 'bg-[#3a3a40]' : ''}`}
            >
              <Building className="h-4 w-4 mr-2" />
              <span>Agent Portal</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#3a3a40]" />
            
            <DropdownMenuItem 
              onClick={() => switchRole('admin')}
              className={`flex items-center cursor-pointer ${!isAgentActive ? 'bg-[#3a3a40]' : ''}`}
            >
              <Shield className="h-4 w-4 mr-2" />
              <span>Admin Portal</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
