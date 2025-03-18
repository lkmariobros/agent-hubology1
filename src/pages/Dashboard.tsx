
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
      <p className="text-gray-400 mb-6">Welcome to your dashboard! This is a placeholder.</p>
      <Button 
        variant="outline"
        onClick={() => navigate('/')} 
        className="border-gray-700 hover:bg-gray-800 text-white"
      >
        Back to Login
      </Button>
    </div>
  );
};

export default Dashboard;
