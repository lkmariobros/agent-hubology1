
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Briefcase,
  Trophy,
  BarChart
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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
  {
    icon: Briefcase,
    label: 'Opportunities',
    href: '/opportunities'
  },
  {
    icon: BarChart,
    label: 'Reports',
    href: '/reports'
  },
  {
    icon: Trophy,
    label: 'Leaderboard',
    href: '/leaderboard'
  },
];

export function NavMain() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = location.pathname;

  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>Main</SidebarGroupLabel>}
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
                  size="default"
                >
                  <Link to={item.href} className={collapsed ? "justify-center" : ""}>
                    <item.icon />
                    {!collapsed && <span>{item.label}</span>}
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
