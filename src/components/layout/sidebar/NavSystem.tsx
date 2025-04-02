
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
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Separator } from "@/components/ui/separator";

export function NavSystem() {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>System</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/settings')}
              tooltip="Settings"
            >
              <NavLink to="/admin/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/commission/settings')}
              tooltip="Commission Settings"
            >
              <NavLink to="/admin/commission/settings">
                <DollarSign className="h-4 w-4" />
                <span>Commission Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/commission/schedules')}
              tooltip="Payment Schedules"
            >
              <NavLink to="/admin/commission/schedules">
                <Calendar className="h-4 w-4" />
                <span>Payment Schedules</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/commission/forecast')}
              tooltip="Forecast"
            >
              <NavLink to="/admin/commission/forecast">
                <BarChart3 className="h-4 w-4" />
                <span>Forecast</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Custom styled separator with rounded appearance */}
          <div className="px-2 py-1">
            <div className="h-[2px] rounded-full bg-sidebar-border/20"></div>
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/admin/roles'}
              tooltip="Roles & Permissions"
            >
              <NavLink to="/admin/roles">
                <Shield className="h-4 w-4" />
                <span>Roles & Permissions</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/commission/tiers')}
              tooltip="Commission Tiers"
            >
              <NavLink to="/admin/commission/tiers">
                <ClipboardList className="h-4 w-4" />
                <span>Commission Tiers</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Another custom styled separator */}
          <div className="px-2 py-1">
            <div className="h-[2px] rounded-full bg-sidebar-border/20"></div>
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/system-logs')}
              tooltip="System Logs"
            >
              <NavLink to="/admin/system-logs">
                <FileText className="h-4 w-4" />
                <span>System Logs</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname.includes('/admin/database')}
              tooltip="Database"
            >
              <NavLink to="/admin/database">
                <Database className="h-4 w-4" />
                <span>Database</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
