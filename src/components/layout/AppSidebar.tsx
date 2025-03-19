
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  BarChart4,
  DollarSign,
  Trophy,
  TrendingUp
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Button } from '@/components/ui/button';

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

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center px-2 py-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-white">
            <span className="font-bold text-sm">P</span>
          </div>
          <span className="ml-2 text-lg font-semibold">PropertyPro</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
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
        
        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === '/settings'}
                  tooltip="Settings"
                >
                  <Link to="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-muted-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
