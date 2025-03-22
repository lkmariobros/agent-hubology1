
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { NotificationProvider } from './context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';

// Pages
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Transactions from './pages/Transactions';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Commission from './pages/Commission';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/Properties';
import AdminTransactions from './pages/admin/Transactions';
import CommissionApproval from './pages/admin/CommissionApproval';
import SalesLeaderboard from './pages/leaderboard/Sales';
import PointsLeaderboard from './pages/leaderboard/Points';
import StyleGuide from './pages/StyleGuide';
import TransactionDetail from './pages/TransactionDetail';
import TransactionNewEnhanced from './pages/TransactionNewEnhanced';
import NewProperty from './pages/NewProperty';

// CSS
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Main Layout Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/transactions/new" element={<TransactionNewEnhanced />} />
                  <Route path="/transactions/:id" element={<TransactionDetail />} />
                  <Route path="/properties/new" element={<NewProperty />} />
                  <Route path="/commission" element={<Commission />} />
                  <Route path="/leaderboard/sales" element={<SalesLeaderboard />} />
                  <Route path="/leaderboard/points" element={<PointsLeaderboard />} />
                  <Route path="/style-guide" element={<StyleGuide />} />
                </Route>
                
                {/* Admin Layout Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="commission" element={<CommissionApproval />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
