
import React from 'react';
import { NavLink } from 'react-router-dom';
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
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Database className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Agents">
              <NavLink to="/admin/agents" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Users className="h-4 w-4" />
                <span>Agents</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Properties">
              <NavLink to="/admin/properties" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Building className="h-4 w-4" />
                <span>Properties</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Transactions">
              <NavLink to="/admin/transactions" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Briefcase className="h-4 w-4" />
                <span>Transactions</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Commission">
              <NavLink to="/admin/commission" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
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
