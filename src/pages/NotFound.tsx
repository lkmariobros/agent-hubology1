
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');
  const pathParts = location.pathname.split('/');
  
  // Extract more detailed debug info
  const debugInfo = import.meta.env.DEV ? (
    <div className="mt-4 p-4 border border-dashed border-slate-300 dark:border-slate-700 text-left rounded bg-slate-50 dark:bg-slate-900">
      <p className="text-sm font-mono mb-2">Debug information:</p>
      <ul className="text-xs text-muted-foreground font-mono">
        <li>Requested path: <span className="font-bold">{location.pathname}</span></li>
        <li>Portal: <span className="font-bold">{isAdminRoute ? 'Admin' : 'Agent'}</span></li>
        <li>Path segments: <span className="font-bold">{pathParts.filter(Boolean).join(' → ')}</span></li>
        <li>Query parameters: <span className="font-bold">{location.search || 'None'}</span></li>
      </ul>
    </div>
  ) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl mt-4">Page not found</p>
      <p className="text-sm text-muted-foreground mt-2">
        The requested URL {location.pathname} could not be found
      </p>
      {debugInfo}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link 
          to={isAdminRoute ? "/admin" : "/"} 
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-center"
        >
          Return to {isAdminRoute ? "Admin Dashboard" : "Dashboard"}
        </Link>
        <Link 
          to={isAdminRoute ? "/" : "/admin"}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 text-center"
        >
          Switch to {isAdminRoute ? "Agent Portal" : "Admin Portal"}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
