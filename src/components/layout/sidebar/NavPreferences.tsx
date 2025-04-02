
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

interface NavPreferencesProps {
  collapsed?: boolean;
}

export function NavPreferences({ collapsed }: NavPreferencesProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { open } = useSidebar();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Preferences</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={currentPath === '/settings'}
              tooltip="Settings"
            >
              <Link to="/settings" className={!open ? "justify-center" : ""}>
                <Settings />
                {open && <span>Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
