
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
  TrendingUp,
  ChevronDown,
  Lightbulb
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isActiveSubRoute = (paths: string[]) => {
    return paths.some(path => location.pathname === path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center px-2 py-3">
          {isCollapsed ? (
            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
          ) : (
            <h1 className="font-semibold text-xl">PropertyPro</h1>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/dashboard')}
                  tooltip="Dashboard"
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/properties')}
                  tooltip="Properties"
                  asChild
                >
                  <Link to="/properties">
                    <Building2 />
                    <span>Properties</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/transactions')}
                  tooltip="Transactions"
                  asChild
                >
                  <Link to="/transactions">
                    <FileText />
                    <span>Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/team')}
                  tooltip="Team"
                  asChild
                >
                  <Link to="/team">
                    <Users />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/commission')}
                  tooltip="Commission"
                  asChild
                >
                  <Link to="/commission">
                    <DollarSign />
                    <span>Commission</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveSubRoute(['/leaderboard/points', '/leaderboard/sales'])}
                  tooltip={isCollapsed ? "Leaderboard" : undefined}
                >
                  <Trophy />
                  <span>Leaderboard</span>
                  {!isCollapsed && <ChevronDown className="ml-auto h-4 w-4" />}
                </SidebarMenuButton>
                
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={isActiveRoute('/leaderboard/points')}
                      asChild
                    >
                      <Link to="/leaderboard/points">
                        <TrendingUp />
                        <span>Points</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={isActiveRoute('/leaderboard/sales')}
                      asChild
                    >
                      <Link to="/leaderboard/sales">
                        <DollarSign />
                        <span>Sales</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/opportunities')}
                  tooltip="Opportunities"
                  asChild
                >
                  <Link to="/opportunities">
                    <Lightbulb />
                    <span>Opportunities</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/reports')}
                  tooltip="Reports"
                  asChild
                >
                  <Link to="/reports">
                    <BarChart4 />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActiveRoute('/settings')}
                  tooltip="Settings"
                  asChild
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
        <SidebarMenuButton asChild tooltip="Logout">
          <button className="w-full">
            <LogOut />
            <span>Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
