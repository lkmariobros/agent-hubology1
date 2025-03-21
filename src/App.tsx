import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './providers/AuthProvider';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import NewTransaction from './pages/NewTransaction';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import NewAgent from './pages/NewAgent';
import Commission from './pages/Commission';
import AdminCommission from './pages/AdminCommission';
import AdminCommissionApproval from './pages/admin/CommissionApproval';
import Settings from './pages/Settings';
import AdminAgents from './pages/admin/Agents';
import AdminTransactions from './pages/admin/Transactions';
import AdminProperties from './pages/admin/Properties';
import AdminPropertyDetail from './pages/admin/PropertyDetail';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import NewProperty from './pages/NewProperty';
import Profile from './pages/Profile';
import Index from './pages/Index';
import AdminDashboard from './pages/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                
                {/* Agent Routes */}
                <Route element={<MainLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="transactions/:id" element={<TransactionDetail />} />
                  <Route path="transactions/new" element={<NewTransaction />} />
                  <Route path="agents" element={<Agents />} />
                  <Route path="agents/:id" element={<AgentDetail />} />
                  <Route path="agents/new" element={<NewAgent />} />
                  <Route path="commission" element={<Commission />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="properties/:id" element={<PropertyDetail />} />
                  <Route path="properties/new" element={<NewProperty />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="commission" element={<AdminCommission />} />
                  <Route path="commission/approvals" element={<AdminCommissionApproval />} />
                  <Route path="commission/approvals/:id" element={<AdminCommissionApproval />} />
                  <Route path="agents" element={<AdminAgents />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="properties/:id" element={<AdminPropertyDetail />} />
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="top-right" />
            </NotificationProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
