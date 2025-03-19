
import { createRoot } from 'react-dom/client';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <div className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
    <App />
  </div>
);
