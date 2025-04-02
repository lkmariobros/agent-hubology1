
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, ListChecks, Building, Briefcase, Database } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

export function NavAdmin() {
  const location = useLocation();
  const { pathname } = location;
  const { open } = useSidebar();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[13px] text-white/50 px-4 uppercase font-medium">Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname === '/admin' || pathname === '/admin/dashboard'}
              tooltip="Dashboard"
            >
              <NavLink to="/admin" end className={!open ? "justify-center" : "pl-4"}>
                <Database className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/agents')}
              tooltip="Agents"
            >
              <NavLink to="/admin/agents" className={!open ? "justify-center" : "pl-4"}>
                <Users className="h-4 w-4" />
                <span>Agents</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/properties')}
              tooltip="Properties"
            >
              <NavLink to="/admin/properties" className={!open ? "justify-center" : "pl-4"}>
                <Building className="h-4 w-4" />
                <span>Properties</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/transactions')}
              tooltip="Transactions"
            >
              <NavLink to="/admin/transactions" className={!open ? "justify-center" : "pl-4"}>
                <Briefcase className="h-4 w-4" />
                <span>Transactions</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/commissions')}
              tooltip="Commission"
            >
              <NavLink to="/admin/commissions" className={!open ? "justify-center" : "pl-4"}>
                <ListChecks className="h-4 w-4" />
                <span>Commission</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// Import the useSidebar hook
import { useSidebar } from "@/components/ui/sidebar";
