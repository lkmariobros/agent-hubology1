
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, Database, 
  ClipboardList, Shield,
  FileText, DollarSign,
  Calendar, BarChart3
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
  const { pathname } = location;
  const { isExpanded, isIconOnly } = useSidebar();
  
  return (
    <SidebarGroup className="mt-4">
      <SidebarGroupLabel className="text-[13px] text-white/50 px-4 uppercase font-medium">System</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/settings')}
              tooltip="Settings"
            >
              <NavLink to="/admin/settings" className={!isExpanded ? "justify-center" : "pl-4"}>
                <Settings className="h-4 w-4" />
                {isExpanded && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/commission/settings')}
              tooltip="Commission Settings"
            >
              <NavLink to="/admin/commission/settings" className={!isExpanded ? "justify-center" : "pl-4"}>
                <DollarSign className="h-4 w-4" />
                {isExpanded && <span>Commission Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/commission/schedules')}
              tooltip="Payment Schedules"
            >
              <NavLink to="/admin/commission/schedules" className={!isExpanded ? "justify-center" : "pl-4"}>
                <Calendar className="h-4 w-4" />
                {isExpanded && <span>Payment Schedules</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/commission/forecast')}
              tooltip="Forecast"
            >
              <NavLink to="/admin/commission/forecast" className={!isExpanded ? "justify-center" : "pl-4"}>
                <BarChart3 className="h-4 w-4" />
                {isExpanded && <span>Forecast</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname === '/admin/roles'}
              tooltip="Roles & Permissions"
            >
              <NavLink to="/admin/roles" className={!isExpanded ? "justify-center" : "pl-4"}>
                <Shield className="h-4 w-4" />
                {isExpanded && <span>Roles & Permissions</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/commission/tiers')}
              tooltip="Commission Tiers"
            >
              <NavLink to="/admin/commission/tiers" className={!isExpanded ? "justify-center" : "pl-4"}>
                <ClipboardList className="h-4 w-4" />
                {isExpanded && <span>Commission Tiers</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/system-logs')}
              tooltip="System Logs"
            >
              <NavLink to="/admin/system-logs" className={!isExpanded ? "justify-center" : "pl-4"}>
                <FileText className="h-4 w-4" />
                {isExpanded && <span>System Logs</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname.includes('/admin/database')}
              tooltip="Database"
            >
              <NavLink to="/admin/database" className={!isExpanded ? "justify-center" : "pl-4"}>
                <Database className="h-4 w-4" />
                {isExpanded && <span>Database</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
