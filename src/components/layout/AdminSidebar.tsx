
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Shield, ChevronsUpDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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

import { NavAdmin } from './sidebar/NavAdmin';
import { NavReports } from './sidebar/NavReports';
import { NavSystem } from './sidebar/NavSystem';
import { AdminProfile } from './sidebar/AdminProfile';

export function AdminSidebar() {
  const { user, switchRole } = useAuth();
  const currentRole = user?.activeRole || 'agent';
  const isAdminActive = currentRole === 'admin';

  return (
    <Sidebar className="border-none bg-[#1F232D] AdminSidebar">
      <SidebarHeader>
        {/* Portal Switcher integrated in the sidebar header */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-3 w-full text-left hover:text-primary transition-colors focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white">
                <span className="font-bold text-sm">P</span>
              </div>
              <span className="ml-2 text-lg font-semibold">PropertyPro</span>
              <ChevronsUpDown className="h-4 w-4 opacity-60 ml-auto" />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="start" className="w-[180px] bg-popover">
            <DropdownMenuItem 
              onClick={() => switchRole('agent')}
              className={`flex items-center cursor-pointer ${!isAdminActive ? 'bg-accent/10' : ''}`}
            >
              <Building className="h-4 w-4 mr-2" />
              <span>Agent Portal</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => switchRole('admin')}
              className={`flex items-center cursor-pointer ${isAdminActive ? 'bg-accent/10' : ''}`}
            >
              <Shield className="h-4 w-4 mr-2" />
              <span>Admin Portal</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavAdmin />
        <NavReports />
        <NavSystem />
      </SidebarContent>
      
      <SidebarFooter>
        <AdminProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
