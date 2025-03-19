
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyNew from './pages/PropertyNew';
import PropertyDetail from './pages/PropertyDetail';
import Transactions from './pages/Transactions';
import TransactionNew from './pages/TransactionNew';
import Opportunities from './pages/Opportunities';
import Commission from './pages/Commission';
import AdminCommission from './pages/AdminCommission';
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
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/properties" element={<MainLayout><Properties /></MainLayout>} />
          <Route path="/properties/new" element={<MainLayout><PropertyNew /></MainLayout>} />
          <Route path="/properties/:id" element={<MainLayout><PropertyDetail /></MainLayout>} />
          <Route path="/transactions" element={<MainLayout><Transactions /></MainLayout>} />
          <Route path="/transactions/new" element={<MainLayout><TransactionNew /></MainLayout>} />
          <Route path="/opportunities" element={<MainLayout><Opportunities /></MainLayout>} />
          <Route path="/commission" element={<MainLayout><Commission /></MainLayout>} />
          <Route path="/admin/commission" element={<MainLayout><AdminCommission /></MainLayout>} />
          <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/leaderboard/points" element={<MainLayout><Points /></MainLayout>} />
          <Route path="/leaderboard/sales" element={<MainLayout><Sales /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
