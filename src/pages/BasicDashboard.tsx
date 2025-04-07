import React from 'react';

const BasicDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Total Commission</h2>
          <p className="text-3xl font-bold">$24,500</p>
          <p className="text-green-500">+12% from last month</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Leaderboard Position</h2>
          <p className="text-3xl font-bold">#3</p>
          <p className="text-green-500">+2 positions from last month</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <ul className="space-y-2">
            <li>123 Main St - $450,000</li>
            <li>456 Oak Ave - $320,000</li>
            <li>789 Pine Rd - $550,000</li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
          <ul className="space-y-2">
            <li>123 Main St - $13,500 (Oct 15)</li>
            <li>456 Oak Ave - $9,600 (Oct 22)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BasicDashboard;
