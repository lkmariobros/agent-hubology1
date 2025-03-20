
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart4,
  Trophy,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Analytics navigation data
const reportsNavItems = [
  { 
    icon: Trophy, 
    label: 'Leaderboard',
    submenu: [
      {
        icon: TrendingUp,
        label: 'Points',
        href: '/leaderboard/points'
      },
      {
        icon: DollarSign,
        label: 'Sales',
        href: '/leaderboard/sales'
      }
    ]
  },
  { 
    icon: BarChart4, 
    label: 'Reports', 
    href: '/reports' 
  },
];

export function NavAnalytics() {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Analytics</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {reportsNavItems.map((item) => 
            !item.submenu ? (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === item.href}
                  tooltip={item.label}
                  size="default"
                >
                  <Link to={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={item.submenu.some(sub => location.pathname === sub.href)}
                  size="default"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {item.submenu.map(subItem => (
                    <SidebarMenuSubItem key={subItem.href}>
                      <SidebarMenuSubButton 
                        asChild
                        isActive={location.pathname === subItem.href}
                        size="md"
                      >
                        <Link to={subItem.href}>
                          <subItem.icon />
                          <span>{subItem.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
