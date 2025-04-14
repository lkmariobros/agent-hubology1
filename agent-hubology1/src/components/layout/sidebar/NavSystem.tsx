
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Database, 
  FileText, 
  CircleDollarSign, 
  CalendarClock, 
  LineChart, 
  ShieldCheck, 
  BarChart4 
} from 'lucide-react';
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
              isActive={location.pathname === '/admin/settings'}
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
              isActive={location.pathname === '/admin/commission/settings'}
              tooltip="Commission Settings"
            >
              <NavLink to="/admin/commission/settings" className={collapsed ? "justify-center" : "pl-4"}>
                <CircleDollarSign className="h-4 w-4" />
                {!collapsed && <span>Commission Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin/commission/schedules'}
              tooltip="Payment Schedules"
            >
              <NavLink to="/admin/commission/schedules" className={collapsed ? "justify-center" : "pl-4"}>
                <CalendarClock className="h-4 w-4" />
                {!collapsed && <span>Payment Schedules</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin/commission/forecast'}
              tooltip="Forecast"
            >
              <NavLink to="/admin/commission/forecast" className={collapsed ? "justify-center" : "pl-4"}>
                <LineChart className="h-4 w-4" />
                {!collapsed && <span>Forecast</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin/roles'}
              tooltip="Roles & Permissions"
            >
              <NavLink to="/admin/roles" className={collapsed ? "justify-center" : "pl-4"}>
                <ShieldCheck className="h-4 w-4" />
                {!collapsed && <span>Roles & Permissions</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin/commission/tiers'}
              tooltip="Commission Tiers"
            >
              <NavLink to="/admin/commission/tiers" className={collapsed ? "justify-center" : "pl-4"}>
                <BarChart4 className="h-4 w-4" />
                {!collapsed && <span>Commission Tiers</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin/system-logs'}
              tooltip="System Logs"
            >
              <NavLink to="/admin/system-logs" className={collapsed ? "justify-center" : "pl-4"}>
                <FileText className="h-4 w-4" />
                {!collapsed && <span>System Logs</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin/database'}
              tooltip="Database"
            >
              <NavLink to="/admin/database" className={collapsed ? "justify-center" : "pl-4"}>
                <Database className="h-4 w-4" />
                {!collapsed && <span>Database</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
