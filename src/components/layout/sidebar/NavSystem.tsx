
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Shield, Layers, FileText, Database } from 'lucide-react';
import { SidebarNav, SidebarNavHeader, SidebarNavHeaderTitle, SidebarNavLink, SidebarNavList } from '@/components/ui/sidebar';

export function NavSystem() {
  return (
    <SidebarNav>
      <SidebarNavHeader>
        <SidebarNavHeaderTitle>System</SidebarNavHeaderTitle>
      </SidebarNavHeader>
      <SidebarNavList>
        <SidebarNavLink asChild>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <Settings className="h-4 w-4" />
            Settings
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/roles" className={({ isActive }) => isActive ? 'active' : ''}>
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/tiers" className={({ isActive }) => isActive ? 'active' : ''}>
            <Layers className="h-4 w-4" />
            Commission Tiers
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/logs" className={({ isActive }) => isActive ? 'active' : ''}>
            <FileText className="h-4 w-4" />
            System Logs
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/database" className={({ isActive }) => isActive ? 'active' : ''}>
            <Database className="h-4 w-4" />
            Database
          </NavLink>
        </SidebarNavLink>
      </SidebarNavList>
    </SidebarNav>
  );
}
