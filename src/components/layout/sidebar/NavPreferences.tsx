
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";

export function NavPreferences() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = location.pathname;
  
  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>Preferences</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={currentPath === '/settings'}
              tooltip="Settings"
            >
              <Link to="/settings" className={collapsed ? "justify-center" : ""}>
                <Settings />
                {!collapsed && <span>Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
