
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ensureStorageBuckets } from './utils/setupStorage';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

// Check and create storage buckets on app start
ensureStorageBuckets()
  .then(result => {
    if (result.success) {
      console.log('Storage buckets initialized successfully');
    } else {
      console.warn('Storage buckets initialization failed:', result.error);
    }
  })
  .catch(error => {
    console.error('Error initializing storage buckets:', error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
