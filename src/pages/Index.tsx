
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-black p-4"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    >
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="font-bold text-xl text-white">P</span>
          </div>
          <h1 className="text-4xl font-bold text-white">PropertyPro</h1>
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-6">
          Property Agency System
        </h2>
        
        <p className="text-gray-300 mb-8">
          A comprehensive solution for managing property listings, transactions, agent commissions, and more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 text-lg"
          >
            Sign In
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/login')}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-2 text-lg"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
