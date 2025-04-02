
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChartBig, TrendingUp, LayoutDashboard, LineChart } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

export function NavReports() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "icon";
  
  return (
    <SidebarGroup className={collapsed ? "" : "mt-4"}>
      {!collapsed && (
        <SidebarGroupLabel className="text-[13px] text-white/50 px-4 uppercase font-medium">
          Reports
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/overview')}
              tooltip="Overview"
            >
              <NavLink to="/admin/reports/overview" className={collapsed ? "justify-center" : "pl-4"}>
                <LayoutDashboard className="h-4 w-4" />
                {!collapsed && <span>Overview</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/performance')}
              tooltip="Performance"
            >
              <NavLink to="/admin/reports/performance" className={collapsed ? "justify-center" : "pl-4"}>
                <TrendingUp className="h-4 w-4" />
                {!collapsed && <span>Performance</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/sales')}
              tooltip="Sales Analytics"
            >
              <NavLink to="/admin/reports/sales" className={collapsed ? "justify-center" : "pl-4"}>
                <BarChartBig className="h-4 w-4" />
                {!collapsed && <span>Sales Analytics</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/reports/custom')}
              tooltip="Custom Reports"
            >
              <NavLink to="/admin/reports/custom" className={collapsed ? "justify-center" : "pl-4"}>
                <LineChart className="h-4 w-4" />
                {!collapsed && <span>Custom Reports</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
