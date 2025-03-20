
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChartBig, TrendingUp, LayoutDashboard, LineChart } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

export function NavReports() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Reports</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Overview">
              <NavLink to="/admin/reports/overview" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Performance">
              <NavLink to="/admin/reports/performance" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <TrendingUp className="h-4 w-4" />
                <span>Performance</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sales Analytics">
              <NavLink to="/admin/reports/sales" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <BarChartBig className="h-4 w-4" />
                <span>Sales Analytics</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Custom Reports">
              <NavLink to="/admin/reports/custom" className={({ isActive }) => isActive ? 'data-[active=true]' : ''}>
                <LineChart className="h-4 w-4" />
                <span>Custom Reports</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
