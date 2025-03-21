
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
