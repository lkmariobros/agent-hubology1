
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyNew from './pages/PropertyNew';
import PropertyDetail from './pages/PropertyDetail';
import Transactions from './pages/Transactions';
import TransactionNew from './pages/TransactionNew';
import Opportunities from './pages/Opportunities';
import Commission from './pages/Commission';
import Team from './pages/Team';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Points from './pages/leaderboard/Points';
import Sales from './pages/leaderboard/Sales';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

import './App.css';

// Create a new query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/new" element={<PropertyNew />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/new" element={<TransactionNew />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard/points" element={<Points />} />
          <Route path="/leaderboard/sales" element={<Sales />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
