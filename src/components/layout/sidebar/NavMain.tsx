
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  FileText, 
  Users, 
  DollarSign
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";

// Main navigation data
const mainNavItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/dashboard',
  },
  { 
    icon: Building2, 
    label: 'Properties', 
    href: '/properties' 
  },
  { 
    icon: FileText, 
    label: 'Transactions', 
    href: '/transactions' 
  },
  { 
    icon: Users, 
    label: 'Team', 
    href: '/team' 
  },
  { 
    icon: DollarSign, 
    label: 'Commission', 
    href: '/commission' 
  },
];

interface NavMainProps {
  collapsed?: boolean;
}

export function NavMain({ collapsed }: NavMainProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isExpanded, isIconOnly } = useSidebar();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {mainNavItems.map((item) => {
            // Check if current path starts with this item's href (for nested routes)
            const isActive = currentPath === item.href || 
                           (item.href !== '/dashboard' && currentPath.startsWith(item.href));
            
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link to={item.href} className={!isExpanded ? "justify-center" : ""}>
                    <item.icon />
                    {isExpanded && <span>{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
