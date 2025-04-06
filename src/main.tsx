
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ensureStorageBuckets } from './utils/setupStorage';

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
    <App />
  </React.StrictMode>,
);
