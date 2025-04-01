
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Users, 
  DollarSign,
  Trophy,
  BarChart3,
  Settings
} from 'lucide-react';

export function NavigationSidebar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-[#1A1F2C] text-white">
      <div className="flex items-center gap-2 p-4 mb-6">
        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
          <span className="font-bold text-lg">P</span>
        </div>
        <span className="text-xl font-semibold">PropertyPro</span>
      </div>
      
      <nav className="flex-1 px-2">
        {/* Main Section */}
        <div className="mb-6">
          <h2 className="text-xs uppercase text-gray-400 font-medium px-4 mb-2">Main</h2>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/properties"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Building2 className="h-5 w-5 mr-3" />
                Properties
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <FileText className="h-5 w-5 mr-3" />
                Transactions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/team"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Users className="h-5 w-5 mr-3" />
                Team
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/commission"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <DollarSign className="h-5 w-5 mr-3" />
                Commission
              </NavLink>
            </li>
          </ul>
        </div>
        
        {/* Analytics Section */}
        <div className="mb-6">
          <h2 className="text-xs uppercase text-gray-400 font-medium px-4 mb-2">Analytics</h2>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Trophy className="h-5 w-5 mr-3" />
                Leaderboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Reports
              </NavLink>
            </li>
          </ul>
        </div>
        
        {/* Preferences Section */}
        <div className="mb-6">
          <h2 className="text-xs uppercase text-gray-400 font-medium px-4 mb-2">Preferences</h2>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
        
        {isAdmin && (
          <div className="mb-6">
            <h2 className="text-xs uppercase text-gray-400 font-medium px-4 mb-2">Admin</h2>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/admin/commission-approval"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <DollarSign className="h-5 w-5 mr-3" />
                  Commission Approvals
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>
      
      <div className="mt-auto border-t border-gray-800 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
            <span className="font-bold text-sm">JO</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">josephkwantum</p>
            <p className="text-xs text-gray-400">admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
