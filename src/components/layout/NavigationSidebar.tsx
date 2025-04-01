
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Home, Users, FileText, Calendar, Settings, ShieldCheck } from 'lucide-react';

export function NavigationSidebar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-[#1F232D]">
      <div className="px-4 py-6">
        <span className="block text-sm font-semibold text-gray-400">
          Logged in as: {user?.email}
        </span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-600/20 hover:text-white ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300'
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
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-600/20 hover:text-white ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300'
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
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-600/20 hover:text-white ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300'
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
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-600/20 hover:text-white ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300'
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
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-600/20 hover:text-white ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300'
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
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-purple-600/20 hover:text-white ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300'
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
          className="group flex items-center rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <span className="w-full text-center py-2">
            Learn More
          </span>
        </a>
      </div>
    </div>
  );
}
