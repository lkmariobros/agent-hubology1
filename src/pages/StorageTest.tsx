import React from 'react';
import StorageTest from '@/components/storage/StorageTest';

const StorageTestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Storage Policies Test</h1>
      <p className="mb-6 text-gray-600">
        This page allows you to test the storage policies with Clerk JWT integration.
        You can upload, view, and delete files in your user-specific folder.
      </p>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <h2 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Testing Instructions</h2>
        <ol className="list-decimal list-inside text-sm space-y-1 text-blue-700 dark:text-blue-300">
          <li>Upload a test file by clicking the "Upload Test File" button</li>
          <li>Verify that the file appears in the list</li>
          <li>Test accessing the file by clicking "View File"</li>
          <li>Test deleting the file by clicking "Delete"</li>
        </ol>
      </div>
      
      <StorageTest />
    </div>
  );
};

export default StorageTestPage;