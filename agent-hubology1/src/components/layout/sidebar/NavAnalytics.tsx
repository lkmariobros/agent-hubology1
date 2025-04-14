
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";

export function NavAnalytics() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = location.pathname;
  
  const isLeaderboardPage = currentPath.startsWith('/leaderboard');
  const isReportsPage = currentPath.startsWith('/reports');
  
  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>Analytics</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isLeaderboardPage}
              tooltip="Leaderboard"
            >
              <Link to="/leaderboard" className={collapsed ? "justify-center" : ""}>
                <Trophy />
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
                <BarChart />
                {!collapsed && <span>Reports</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
