import React from 'react';
import NotificationsRealtimeTest from '@/components/notifications/NotificationsRealtimeTest';
import MainLayout from '@/components/layout/MainLayout';

const NotificationsTest: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications Realtime Testing</h1>
      <p className="mb-6 text-gray-600">
        This page allows you to test the realtime notifications functionality with Clerk JWT integration.
        Create test notifications and observe realtime updates across browser windows.
      </p>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <h2 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Testing Instructions</h2>
        <ol className="list-decimal list-inside text-sm space-y-1 text-blue-700 dark:text-blue-300">
          <li>Open this page in two separate browser windows or tabs</li>
          <li>Click "Create Test Notification" in one window</li>
          <li>Watch the other window for real-time updates</li>
          <li>Try marking notifications as read in either window</li>
        </ol>
      </div>
      
      <NotificationsRealtimeTest />
    </div>
  );
};

export default NotificationsTest;