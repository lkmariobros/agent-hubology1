
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Building,
  BarChartBig,
  UserCheck,
  Users,
  Settings,
  MessageSquare,
  Wallet,
  Calendar,
  FileClock,
  LogOut
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';

interface NavigationProps {
  collapsed: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  admin?: boolean;
}

const NavItem = ({ to, icon, label, collapsed, admin = false }: NavItemProps) => {
  const { isAdmin } = useAuth();
  
  if (admin && !isAdmin) return null;
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        cn(
          "flex items-center py-3 px-3 rounded-md text-sm transition-colors",
          collapsed ? "justify-center" : "justify-start",
          isActive 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "hover:bg-primary/10"
        )
      }
    >
      <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
        {icon}
        {!collapsed && <span className="ml-3">{label}</span>}
      </div>
    </NavLink>
  );
};

const NavigationSidebar = ({ collapsed }: NavigationProps) => {
  return (
    <div className="space-y-1 py-2">
      <NavItem to="/dashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" collapsed={collapsed} />
      <NavItem to="/properties" icon={<Building className="h-5 w-5" />} label="Properties" collapsed={collapsed} />
      <NavItem to="/transactions" icon={<Wallet className="h-5 w-5" />} label="Transactions" collapsed={collapsed} />
      <NavItem to="/commission" icon={<BarChartBig className="h-5 w-5" />} label="Commission" collapsed={collapsed} />
      <NavItem to="/schedules" icon={<Calendar className="h-5 w-5" />} label="Schedules" collapsed={collapsed} />
      <NavItem to="/admin/commission-approval" icon={<FileClock className="h-5 w-5" />} label="Approvals" collapsed={collapsed} admin />
      <NavItem to="/team" icon={<Users className="h-5 w-5" />} label="Team" collapsed={collapsed} />
      <NavItem to="/clients" icon={<UserCheck className="h-5 w-5" />} label="Clients" collapsed={collapsed} />
      <NavItem to="/messages" icon={<MessageSquare className="h-5 w-5" />} label="Messages" collapsed={collapsed} />
      <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" collapsed={collapsed} />
      <NavItem to="/logout" icon={<LogOut className="h-5 w-5" />} label="Logout" collapsed={collapsed} />
    </div>
  );
};

export default NavigationSidebar;
