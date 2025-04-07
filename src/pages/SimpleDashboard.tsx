import React from 'react';
import { Button } from '@/components/ui/button';

const SimpleDashboard: React.FC = () => {
  const handleSignOut = () => {
    // Simple sign out - just redirect to sign-in
    window.location.href = '/sign-in';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Agent Hubology Dashboard</h1>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Sign Out
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-300">
              This is a simple dashboard for testing purposes. In a real application, 
              this would show your agent data and statistics.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-400">Properties</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-400">Clients</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-2xl font-bold">$45k</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-700 pb-4 last:border-0">
                <p className="font-medium">New property listing added</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
