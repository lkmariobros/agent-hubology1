
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
  const { pathname } = location;
  const { isExpanded, isIconOnly } = useSidebar();
  
  return (
    <SidebarGroup className="mt-4">
      <SidebarGroupLabel className="text-[13px] text-white/50 px-4 uppercase font-medium">Reports</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/reports/overview')}
              tooltip="Overview"
            >
              <NavLink to="/admin/reports/overview" className={!isExpanded ? "justify-center" : "pl-4"}>
                <LayoutDashboard className="h-4 w-4" />
                {isExpanded && <span>Overview</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/reports/performance')}
              tooltip="Performance"
            >
              <NavLink to="/admin/reports/performance" className={!isExpanded ? "justify-center" : "pl-4"}>
                <TrendingUp className="h-4 w-4" />
                {isExpanded && <span>Performance</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/reports/sales')}
              tooltip="Sales Analytics"
            >
              <NavLink to="/admin/reports/sales" className={!isExpanded ? "justify-center" : "pl-4"}>
                <BarChartBig className="h-4 w-4" />
                {isExpanded && <span>Sales Analytics</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/reports/custom')}
              tooltip="Custom Reports"
            >
              <NavLink to="/admin/reports/custom" className={!isExpanded ? "justify-center" : "pl-4"}>
                <LineChart className="h-4 w-4" />
                {isExpanded && <span>Custom Reports</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
