
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
  SidebarRail,
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
      <SidebarRail />
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center px-4 py-3">
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActiveRoute('/dashboard')}
              tooltip="Dashboard"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
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
                <Building2 className="h-5 w-5" />
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
                <FileText className="h-5 w-5" />
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
                <Users className="h-5 w-5" />
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
                <DollarSign className="h-5 w-5" />
                <span>Commission</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActiveSubRoute(['/leaderboard/points', '/leaderboard/sales'])}
              tooltip={isCollapsed ? "Leaderboard" : undefined}
            >
              <Trophy className="h-5 w-5" />
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
                    <TrendingUp className="h-4 w-4" />
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
                    <DollarSign className="h-4 w-4" />
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
                <Lightbulb className="h-5 w-5" />
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
                <BarChart4 className="h-5 w-5" />
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
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenuButton asChild tooltip="Logout">
          <button className="w-full">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
