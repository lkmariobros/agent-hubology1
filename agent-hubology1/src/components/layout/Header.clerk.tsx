import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import ClerkUserButton from '../auth/ClerkUserButton';
import PageBreadcrumb from './PageBreadcrumb';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  const { isAuthenticated } = useClerkAuth();
  
  // Determine if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
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
        {isAuthenticated && (
          <ClerkUserButton afterSignOutUrl="/" />
        )}
      </div>
    </header>
  );
};

export default Header;
