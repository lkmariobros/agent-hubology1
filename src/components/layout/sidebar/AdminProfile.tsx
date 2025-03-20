
import React from 'react';
import { ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';

export function AdminProfile() {
  return (
    <div className="relative px-3 py-2">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center w-full rounded-lg p-2 text-left bg-transparent hover:bg-secondary/50 transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarImage src="https://i.pravatar.cc/300?u=admin" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="ml-2 flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                System Administrator
              </p>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-64 p-2">
          <div className="flex items-center mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://i.pravatar.cc/300?u=admin" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">
                System Administrator
              </p>
            </div>
          </div>
          <Separator className="my-2" />
          <ScrollArea className="h-auto">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" className="justify-start">
                <User className="mr-2 h-4 w-4" />
                Admin Profile
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Admin Settings
              </Button>
              <Separator className="my-1" />
              <Button variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
