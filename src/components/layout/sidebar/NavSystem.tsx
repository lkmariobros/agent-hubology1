
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Shield, Layers, FileText, Database } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

export function NavSystem() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>System</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Roles & Permissions">
              <NavLink to="/admin/roles" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Shield className="h-4 w-4" />
                <span>Roles & Permissions</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Commission Tiers">
              <NavLink to="/admin/tiers" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Layers className="h-4 w-4" />
                <span>Commission Tiers</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="System Logs">
              <NavLink to="/admin/logs" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <FileText className="h-4 w-4" />
                <span>System Logs</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Database">
              <NavLink to="/admin/database" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <Database className="h-4 w-4" />
                <span>Database</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
