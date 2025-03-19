
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building, ClipboardList, Users, BarChart3, Bell, Settings, LineChart, ArrowUp, Star, Menu, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar/sidebar-context';

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const routes = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building },
    { path: '/transactions', label: 'Transactions', icon: ClipboardList },
    { path: '/team', label: 'Team', icon: Users },
    { path: '/commission', label: 'Commission', icon: BarChart3 },
    { path: '/leaderboard', label: 'Leaderboard', icon: LineChart,
      submenu: [
        { path: '/leaderboard/points', label: 'Points' },
        { path: '/leaderboard/sales', label: 'Sales' }
      ]
    },
    { path: '/opportunities', label: 'Opportunities', icon: Star },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-0 flex items-center justify-between border-b border-border">
        <div className={cn("flex items-center", isCollapsed ? "justify-center w-full px-0" : "px-4")}>
          {!isCollapsed ? (
            <div className="flex items-center py-3">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center mr-2">
                <Building className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
              <span className="font-semibold text-lg">PropertyPro</span>
            </div>
          ) : (
            <div className="py-3 flex items-center justify-center">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                <Building className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-2">
        <nav className="space-y-1">
          {routes.map((route) => {
            const Icon = route.icon;
            
            if (route.submenu) {
              return (
                <div key={route.path} className="space-y-1">
                  <div className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center w-full">
                            <Icon className="h-5 w-5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">{route.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{route.label}</span>
                      </>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="pl-10 space-y-1">
                      {route.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) => cn(
                            "block rounded-md px-3 py-2 text-sm font-medium",
                            isActive 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          )}
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon className="h-5 w-5" />
                    </TooltipTrigger>
                    <TooltipContent side="right">{route.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{route.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="p-2">
        <div className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Bell className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent side="right">Notifications</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Bell className="h-5 w-5 mr-3" />
              <span>Notifications</span>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
