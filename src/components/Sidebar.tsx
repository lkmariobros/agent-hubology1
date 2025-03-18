
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
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
    icon: Trophy, 
    label: 'Leaderboard',
    href: '#',
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
  { 
    icon: Settings, 
    label: 'Settings', 
    href: '/settings' 
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  
  // Check if current path is part of a submenu item
  const isSubmenuActive = (item: any) => {
    if (!item.submenu) return false;
    return item.submenu.some((subItem: any) => location.pathname === subItem.href);
  };
  
  return (
    <div 
      className={cn(
        "h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <Link to="/dashboard">
          <h1 className={cn(
            "font-semibold text-xl text-sidebar-foreground transition-opacity",
            collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            PropertyPro
          </h1>
          {collapsed && (
            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
          )}
        </Link>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
        <TooltipProvider delayDuration={200}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || isSubmenuActive(item);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            
            if (!hasSubmenu) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2.5 group transition-all",
                        isActive 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon 
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          collapsed ? "mx-auto" : "mr-2"
                        )} 
                      />
                      {!collapsed && (
                        <span className="transition-all">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            }
            
            // Handle submenu items
            return (
              <div key={item.label} className="relative">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "w-full flex items-center justify-center rounded-md py-2.5",
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex flex-col space-y-1 min-w-40 p-2">
                      {item.submenu.map((subItem: any) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className="flex items-center px-3 py-2 rounded-md hover:bg-accent/10"
                        >
                          <subItem.icon className="h-4 w-4 mr-2" />
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Collapsible
                    open={openSubmenu === item.label || isActive}
                    onOpenChange={(open) => {
                      setOpenSubmenu(open ? item.label : null);
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "w-full flex items-center justify-between rounded-md px-3 py-2.5",
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-2" />
                          <span>{item.label}</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openSubmenu === item.label || isActive ? "rotate-180" : ""
                          )}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-9 pr-2 space-y-1 pt-1">
                      {item.submenu.map((subItem: any) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={cn(
                              "flex items-center rounded-md px-3 py-2 text-sm",
                              isSubActive 
                                ? "bg-accent/20 text-accent-foreground font-medium" 
                                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                          >
                            <subItem.icon className="h-4 w-4 mr-2" />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            );
          })}
        </TooltipProvider>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
          {!collapsed && (
            <span>Logout</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
