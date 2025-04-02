
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Settings, Database, ShieldAlert } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

export function NavSystem() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
    <SidebarGroup className={collapsed ? "" : "mt-4"}>
      {!collapsed && (
        <SidebarGroupLabel className="text-[13px] text-white/50 px-4 uppercase font-medium">
          System
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/settings')}
              tooltip="Settings"
            >
              <NavLink to="/admin/settings" className={collapsed ? "justify-center" : "pl-4"}>
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/database')}
              tooltip="Database"
            >
              <NavLink to="/admin/database" className={collapsed ? "justify-center" : "pl-4"}>
                <Database className="h-4 w-4" />
                {!collapsed && <span>Database</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/logs')}
              tooltip="System Logs"
            >
              <NavLink to="/admin/logs" className={collapsed ? "justify-center" : "pl-4"}>
                <ShieldAlert className="h-4 w-4" />
                {!collapsed && <span>System Logs</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
