
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Briefcase, ListChecks, CircleDollarSign, Settings } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

export function NavAdmin() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-[13px] text-white/50 px-4 uppercase font-medium">
          Administration
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin' || location.pathname === '/admin/dashboard'}
              tooltip="Dashboard"
            >
              <NavLink to="/admin" end className={collapsed ? "justify-center" : "pl-4"}>
                <LayoutDashboard className="h-4 w-4" />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/agents')}
              tooltip="Agents"
            >
              <NavLink to="/admin/agents" className={collapsed ? "justify-center" : "pl-4"}>
                <Users className="h-4 w-4" />
                {!collapsed && <span>Agents</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/properties')}
              tooltip="Properties"
            >
              <NavLink to="/admin/properties" className={collapsed ? "justify-center" : "pl-4"}>
                <Building className="h-4 w-4" />
                {!collapsed && <span>Properties</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/transactions')}
              tooltip="Transactions"
            >
              <NavLink to="/admin/transactions" className={collapsed ? "justify-center" : "pl-4"}>
                <Briefcase className="h-4 w-4" />
                {!collapsed && <span>Transactions</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/commissions')}
              tooltip="Commission Approvals"
            >
              <NavLink to="/admin/commissions" className={collapsed ? "justify-center" : "pl-4"}>
                <ListChecks className="h-4 w-4" />
                {!collapsed && <span>Commission Approvals</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
