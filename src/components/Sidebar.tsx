
import React from 'react';
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
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/dashboard',
    active: true
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
            collapsed ? "opacity-0 w-0" : "opacity-100"
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
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
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
                  "h-5 w-5 mr-2 flex-shrink-0",
                  collapsed && "mr-0 mx-auto"
                )} 
              />
              <span className={cn(
                "transition-all",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className={cn("h-5 w-5 mr-2", collapsed && "mr-0 mx-auto")} />
          <span className={cn(
            "transition-all",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
