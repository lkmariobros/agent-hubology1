import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SimpleAdminSidebar: React.FC = () => {
  const { collapsed } = { collapsed: false }; // Simplified for now
  
  return (
    <>
      <Sidebar className="border-none bg-[#1A1F2C]">
        <SidebarHeader className={`border-none ${collapsed ? 'px-0 flex justify-center' : 'px-5'} py-4`}>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            {!collapsed && <span className="text-white font-bold">Admin Portal</span>}
          </div>
        </SidebarHeader>
        
        <SidebarContent className={`${collapsed ? 'px-0 flex flex-col items-center' : 'px-3'} py-4 overflow-y-visible space-y-6`}>
          <div className="space-y-1">
            <NavLink to="/admin/dashboard" className={({ isActive }) => 
              `flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 rounded-md ${
                isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }>
              <LayoutDashboard className="h-5 w-5 mr-2" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
            
            <NavLink to="/admin/agents" className={({ isActive }) => 
              `flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 rounded-md ${
                isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }>
              <Users className="h-5 w-5 mr-2" />
              {!collapsed && <span>Agents</span>}
            </NavLink>
            
            <NavLink to="/admin/settings" className={({ isActive }) => 
              `flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 rounded-md ${
                isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }>
              <Settings className="h-5 w-5 mr-2" />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </div>
        </SidebarContent>
        
        <SidebarFooter className={`border-t border-white/5 ${collapsed ? 'px-0 flex justify-center' : 'px-5'} py-3`}>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-700"></div>
            {!collapsed && <span className="text-white">Admin</span>}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
};

export default SimpleAdminSidebar;
