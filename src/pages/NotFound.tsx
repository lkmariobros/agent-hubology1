
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl mt-4">Page not found</p>
      <p className="text-sm text-muted-foreground mt-2">
        The requested URL {location.pathname} was not found
      </p>
      <Link 
        to={isAdminRoute ? "/admin" : "/"} 
        className="mt-6 underline text-primary"
      >
        Return to {isAdminRoute ? "Admin Dashboard" : "Dashboard"}
      </Link>
    </div>
  );
};

export default NotFound;
