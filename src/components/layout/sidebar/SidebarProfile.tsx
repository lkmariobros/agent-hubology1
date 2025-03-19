
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SidebarProfile() {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="w-full justify-start text-muted-foreground"
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span>Logout</span>
    </Button>
  );
}
