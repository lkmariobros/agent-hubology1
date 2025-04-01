
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, Database, 
  ClipboardList, Shield,
  FileText, DollarSign
} from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

export function NavSystem() {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>System</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/settings')}
              tooltip="Settings"
            >
              <NavLink to="/admin/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/commission/settings')}
              tooltip="Commission Settings"
            >
              <NavLink to="/admin/commission/settings">
                <DollarSign className="h-4 w-4" />
                <span>Commission Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/roles')}
              tooltip="Roles & Permissions"
            >
              <NavLink to="/admin/roles">
                <Shield className="h-4 w-4" />
                <span>Roles & Permissions</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/commission-tiers')}
              tooltip="Commission Tiers"
            >
              <NavLink to="/admin/commission-tiers">
                <ClipboardList className="h-4 w-4" />
                <span>Commission Tiers</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/system-logs')}
              tooltip="System Logs"
            >
              <NavLink to="/admin/system-logs">
                <FileText className="h-4 w-4" />
                <span>System Logs</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/database')}
              tooltip="Database"
            >
              <NavLink to="/admin/database">
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
