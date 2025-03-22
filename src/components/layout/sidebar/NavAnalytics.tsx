
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart,
  LineChart,
  Trophy
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

interface NavAnalyticsProps {
  collapsed?: boolean;
}

export function NavAnalytics({ collapsed }: NavAnalyticsProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isLeaderboardPage = currentPath.startsWith('/leaderboard');
  const isReportsPage = currentPath.startsWith('/reports');
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Analytics</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isLeaderboardPage}
              tooltip="Leaderboard"
            >
              <Link to="/leaderboard" className={collapsed ? "justify-center" : ""}>
                <Trophy className="h-4 w-4" />
                {!collapsed && <span>Leaderboard</span>}
              </Link>
            </SidebarMenuButton>
            {!collapsed && isLeaderboardPage && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={currentPath === '/leaderboard/points'}
                  >
                    <Link to="/leaderboard/points">Points</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={currentPath === '/leaderboard/sales'}
                  >
                    <Link to="/leaderboard/sales">Sales</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isReportsPage}
              tooltip="Reports"
            >
              <Link to="/reports" className={collapsed ? "justify-center" : ""}>
                <BarChart className="h-4 w-4" />
                {!collapsed && <span>Reports</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
