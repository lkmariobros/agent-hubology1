
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, ListChecks, Building, Briefcase, Database } from 'lucide-react';
import { SidebarNav, SidebarNavHeader, SidebarNavHeaderTitle, SidebarNavLink, SidebarNavList } from '@/components/ui/sidebar';

export function NavAdmin() {
  return (
    <SidebarNav>
      <SidebarNavHeader>
        <SidebarNavHeaderTitle>Administration</SidebarNavHeaderTitle>
      </SidebarNavHeader>
      <SidebarNavList>
        <SidebarNavLink asChild>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <Database className="h-4 w-4" />
            Dashboard
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/agents" className={({ isActive }) => isActive ? 'active' : ''}>
            <Users className="h-4 w-4" />
            Agents
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/properties" className={({ isActive }) => isActive ? 'active' : ''}>
            <Building className="h-4 w-4" />
            Properties
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
            <Briefcase className="h-4 w-4" />
            Transactions
          </NavLink>
        </SidebarNavLink>
        <SidebarNavLink asChild>
          <NavLink to="/admin/commission" className={({ isActive }) => isActive ? 'active' : ''}>
            <ListChecks className="h-4 w-4" />
            Commission
          </NavLink>
        </SidebarNavLink>
      </SidebarNavList>
    </SidebarNav>
  );
}
