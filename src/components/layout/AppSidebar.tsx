
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { Button } from '@/components/ui/button';
import { NavMain } from './sidebar/NavMain';
import { NavAnalytics } from './sidebar/NavAnalytics';
import { NavPreferences } from './sidebar/NavPreferences';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center px-2 py-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-white">
            <span className="font-bold text-sm">P</span>
          </div>
          <span className="ml-2 text-lg font-semibold">PropertyPro</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain />
        <NavAnalytics />
        <NavPreferences />
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-muted-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
