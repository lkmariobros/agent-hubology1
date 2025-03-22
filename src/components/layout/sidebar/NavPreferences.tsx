
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
} from "@/components/ui/sidebar";

interface NavPreferencesProps {
  collapsed?: boolean;
}

export function NavPreferences({ collapsed }: NavPreferencesProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <SidebarGroup className="py-1 mb-2 px-2">
      <SidebarGroupLabel className="px-2">Preferences</SidebarGroupLabel>
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
