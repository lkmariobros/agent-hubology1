
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

const AppLayout: React.FC = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AppLayout;
