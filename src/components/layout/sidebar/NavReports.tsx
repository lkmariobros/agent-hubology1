
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Reports</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/overview')}
              tooltip="Overview"
            >
              <NavLink to="/admin/reports/overview">
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/performance')}
              tooltip="Performance"
            >
              <NavLink to="/admin/reports/performance">
                <TrendingUp className="h-4 w-4" />
                <span>Performance</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/sales')}
              tooltip="Sales Analytics"
            >
              <NavLink to="/admin/reports/sales">
                <BarChartBig className="h-4 w-4" />
                <span>Sales Analytics</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/custom')}
              tooltip="Custom Reports"
            >
              <NavLink to="/admin/reports/custom">
                <LineChart className="h-4 w-4" />
                <span>Custom Reports</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Add separator at the bottom of this section to match the screenshot */}
          <div className="px-3 py-3">
            <div className="h-[1px] rounded-full bg-white/5"></div>
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
