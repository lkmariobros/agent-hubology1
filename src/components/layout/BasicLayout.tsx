import React, { useState } from 'react';
import { SignedIn, useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRole, setActiveRole] = useState<'agent' | 'admin'>(location.pathname.includes('/admin') ? 'admin' : 'agent');

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleRoleSwitch = (role: 'agent' | 'admin') => {
    setActiveRole(role);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <SignedIn>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#161920] p-4">
          <h2 className="text-xl font-bold text-white mb-6">Agent Hubology</h2>
          <nav className="space-y-2">
            {activeRole === 'agent' ? (
              // Agent navigation
              <>
                <div
                  className={`p-2 ${location.pathname === '/dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/dashboard')}
                >
                  Dashboard
                </div>
                <div
                  className={`p-2 ${location.pathname === '/properties' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/properties')}
                >
                  Properties
                </div>
                <div
                  className={`p-2 ${location.pathname === '/transactions' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/transactions')}
                >
                  Transactions
                </div>
                <div
                  className={`p-2 ${location.pathname === '/reports' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/reports')}
                >
                  Reports
                </div>
                <div
                  className={`p-2 ${location.pathname === '/settings' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/settings')}
                >
                  Settings
                </div>
              </>
            ) : (
              // Admin navigation
              <>
                <div
                  className={`p-2 ${location.pathname === '/admin/dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/admin/dashboard')}
                >
                  Admin Dashboard
                </div>
                <div
                  className={`p-2 ${location.pathname === '/admin/users' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/admin/users')}
                >
                  Users
                </div>
                <div
                  className={`p-2 ${location.pathname === '/admin/properties' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/admin/properties')}
                >
                  Properties
                </div>
                <div
                  className={`p-2 ${location.pathname === '/admin/settings' ? 'bg-blue-600' : 'hover:bg-gray-800'} text-white rounded cursor-pointer`}
                  onClick={() => handleNavigation('/admin/settings')}
                >
                  Settings
                </div>
              </>
            )}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#0f1117]">
          <header className="bg-[#161920] p-4 flex justify-between items-center">
            <h1 className="text-white">Welcome, {user?.firstName || 'User'}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-800 rounded-md overflow-hidden">
                <button
                  className={`px-4 py-2 ${activeRole === 'agent' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => handleRoleSwitch('agent')}
                >
                  Agent
                </button>
                <button
                  className={`px-4 py-2 ${activeRole === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => handleRoleSwitch('admin')}
                >
                  Admin
                </button>
              </div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SignedIn>
  );
};

export default BasicLayout;
