
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl mt-4">Page not found</p>
      <Link to="/" className="mt-6 underline text-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
