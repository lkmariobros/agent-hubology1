import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Home, Users, FileText, Calendar, Settings, ShieldCheck } from 'lucide-react';

export function NavigationSidebar() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="flex flex-col h-full bg-secondary border-r border-muted/50">
      <div className="px-4 py-6">
        <span className="block text-sm font-semibold text-muted-foreground">
          Logged in as: {user?.email}
        </span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`
              }
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`
              }
            >
              <Users className="h-4 w-4 mr-2" />
              Properties
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/commission"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`
              }
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Commission
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/schedules"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              Payment Schedules
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink
                to="/admin/commission-approval"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin: Commission Approvals
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="p-4">
        <a
          href="https://propify.webflow.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent-foreground hover:text-accent transition-colors"
        >
          <span className="w-full text-center py-2">
            Learn More
          </span>
        </a>
      </div>
    </div>
  );
}
