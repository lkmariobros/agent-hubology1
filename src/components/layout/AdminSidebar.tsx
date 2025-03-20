
import React from 'react';
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavAdmin } from './sidebar/NavAdmin';
import { NavReports } from './sidebar/NavReports';
import { NavSystem } from './sidebar/NavSystem';
import { AdminProfile } from './sidebar/AdminProfile';

export function AdminSidebar() {
  return (
    <Sidebar className="border-none bg-[#0F0E11]">
      <SidebarHeader>
        <Link to="/admin/dashboard" className="flex items-center px-2 py-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-white">
            <span className="font-bold text-sm">A</span>
          </div>
          <span className="ml-2 text-lg font-semibold">PropertyPro <span className="text-xs font-normal text-accent">ADMIN</span></span>
        </Link>
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
