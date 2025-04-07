
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, Briefcase, DollarSign, Users, FileText, BarChart4, Settings } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

export function NavMain() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-xs uppercase text-muted-foreground px-4">
          Main Navigation
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/dashboard'}
              tooltip="Dashboard"
            >
              <NavLink to="/dashboard" className={collapsed ? "justify-center" : "pl-4"}>
                <LayoutDashboard className="h-4 w-4" />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/properties')}
              tooltip="Properties"
            >
              <NavLink to="/properties" className={collapsed ? "justify-center" : "pl-4"}>
                <Building className="h-4 w-4" />
                {!collapsed && <span>Properties</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/transactions')}
              tooltip="Transactions"
            >
              <NavLink to="/transactions" className={collapsed ? "justify-center" : "pl-4"}>
                <Briefcase className="h-4 w-4" />
                {!collapsed && <span>Transactions</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/commission')}
              tooltip="Commission"
            >
              <NavLink to="/commission" className={collapsed ? "justify-center" : "pl-4"}>
                <DollarSign className="h-4 w-4" />
                {!collapsed && <span>Commission</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/team')}
              tooltip="Team"
            >
              <NavLink to="/team" className={collapsed ? "justify-center" : "pl-4"}>
                <Users className="h-4 w-4" />
                {!collapsed && <span>Team</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/reports')}
              tooltip="Reports"
            >
              <NavLink to="/reports" className={collapsed ? "justify-center" : "pl-4"}>
                <FileText className="h-4 w-4" />
                {!collapsed && <span>Reports</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/leaderboard')}
              tooltip="Leaderboard"
            >
              <NavLink to="/leaderboard" className={collapsed ? "justify-center" : "pl-4"}>
                <BarChart4 className="h-4 w-4" />
                {!collapsed && <span>Leaderboard</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/settings')}
              tooltip="Settings"
            >
              <NavLink to="/settings" className={collapsed ? "justify-center" : "pl-4"}>
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
