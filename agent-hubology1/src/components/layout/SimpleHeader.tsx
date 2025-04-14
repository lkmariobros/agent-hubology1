import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import PageBreadcrumb from './PageBreadcrumb';

interface SimpleHeaderProps {
  className?: string;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ className }) => {
  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-[#1A1F2C] px-4 ${className}`}>
      <SidebarTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SidebarTrigger>
      
      <div className="flex-1">
        <PageBreadcrumb />
      </div>
      
      <div className="flex items-center gap-4">
        <UserButton 
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8",
            }
          }}
        />
      </div>
    </header>
  );
};

export default SimpleHeader;
