
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChartBig, TrendingUp, LayoutDashboard, LineChart } from 'lucide-react';
import { SidebarNav, SidebarNavHeader, SidebarNavHeaderTitle, SidebarNavLink, SidebarNavList } from '@/components/ui/sidebar';

export function NavReports() {
  return (
    <SidebarNav>
      <SidebarNavHeader>
        <SidebarNavHeaderTitle>Reports</SidebarNavHeaderTitle>
      </SidebarNavHeader>
      <SidebarNavList>
        <SidebarNavLink asChild>
          <NavLink to="/admin/reports/overview" className={({ isActive }) => isActive ? 'active' : ''}>
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/reports/performance" className={({ isActive }) => isActive ? 'active' : ''}>
            <TrendingUp className="h-4 w-4" />
            Performance
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/reports/sales" className={({ isActive }) => isActive ? 'active' : ''}>
            <BarChartBig className="h-4 w-4" />
            Sales Analytics
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/reports/custom" className={({ isActive }) => isActive ? 'active' : ''}>
            <LineChart className="h-4 w-4" />
            Custom Reports
          </NavLink>
        </SidebarNavLink>
      </SidebarNavList>
    </SidebarNav>
  );
}
