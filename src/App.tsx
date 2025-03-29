
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

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
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Opportunities from './pages/Opportunities';
import Reports from './pages/Reports';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin System Pages
import AdminSettings from './pages/admin/Settings';
import Roles from './pages/admin/Roles';
import CommissionTiers from './pages/admin/CommissionTiers';
import SystemLogs from './pages/admin/SystemLogs';
import Database from './pages/admin/Database';

// Configure the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: import.meta.env.PROD, // Only refetch on window focus in production
      retry: 1, // Limit retries on failure
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
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="home" element={<Home />} />
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
                  <Route path="team" element={<Home />} /> {/* Temporary placeholder */}
                  <Route path="opportunities" element={<Opportunities />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="leaderboard" element={<Home />} /> {/* Temporary placeholder */}
                  <Route path="leaderboard/points" element={<Home />} /> {/* Temporary placeholder */}
                  <Route path="leaderboard/sales" element={<Home />} /> {/* Temporary placeholder */}
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="commission" element={<AdminCommission />} />
                  <Route path="commission/approvals" element={<AdminCommissionApproval />} />
                  <Route path="commission/approvals/:id" element={<AdminCommissionApproval />} />
                  <Route path="agents" element={<AdminAgents />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="properties/:id" element={<AdminPropertyDetail />} />
                  
                  {/* Reports Routes */}
                  <Route path="reports/overview" element={<Reports />} />
                  <Route path="reports/performance" element={<Reports />} />
                  <Route path="reports/sales" element={<Reports />} />
                  <Route path="reports/custom" element={<Reports />} />
                  
                  {/* System Routes */}
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="roles" element={<Roles />} />
                  <Route path="commission-tiers" element={<CommissionTiers />} />
                  <Route path="system-logs" element={<SystemLogs />} />
                  <Route path="database" element={<Database />} />
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="top-right" richColors />
            </NotificationProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
