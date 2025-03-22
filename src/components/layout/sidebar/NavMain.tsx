
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Building2,
  Receipt,
  Users,
  BarChart3,
  Settings,
  Bookmark,
  Bell,
  Palette
} from 'lucide-react';

const NavMain = () => {
  return (
    <div className="space-y-1">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <Home className="mr-2 h-4 w-4" />
        Dashboard
      </NavLink>
      
      <NavLink
        to="/properties"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <Building2 className="mr-2 h-4 w-4" />
        Properties
      </NavLink>
      
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
        end
      >
        <Receipt className="mr-2 h-4 w-4" />
        Transactions
      </NavLink>
      
      <NavLink
        to="/clients"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <Users className="mr-2 h-4 w-4" />
        Clients
      </NavLink>
      
      <NavLink
        to="/leaderboard/sales"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Leaderboard
      </NavLink>
      
      <NavLink
        to="/commission"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <Bookmark className="mr-2 h-4 w-4" />
        Commission
      </NavLink>
      
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <Bell className="mr-2 h-4 w-4" />
        Notifications
      </NavLink>
      
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </NavLink>

      <NavLink
        to="/style-guide"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
          }`
        }
      >
        <Palette className="mr-2 h-4 w-4" />
        Style Guide
      </NavLink>
    </div>
  );
};

export default NavMain;
