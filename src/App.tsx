
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './context/auth';
import { NotificationProvider } from './context/NotificationContext';

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
import Team from './pages/Team';
import CommissionForecastPage from './pages/admin/CommissionForecast';

// Leaderboard Pages
import Leaderboard from './pages/leaderboard/Leaderboard';
import PointsLeaderboard from './pages/leaderboard/Points';
import SalesLeaderboard from './pages/leaderboard/Sales';

// Admin System Pages
import AdminSettings from './pages/admin/Settings';
import Roles from './pages/admin/Roles';
import CommissionTiers from './pages/admin/CommissionTiers';
import CommissionSettings from './pages/admin/CommissionSettings';
import PaymentSchedulesAdmin from './pages/admin/PaymentSchedulesAdmin';
import SystemLogs from './pages/admin/SystemLogs';
import Database from './pages/admin/Database';

// Configure the QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: import.meta.env.PROD ? 60 * 1000 : 0, // 1 minute in production, 0 in development
      gcTime: import.meta.env.PROD ? 5 * 60 * 1000 : 60 * 1000, // 5 minutes in prod, 1 minute in dev
      refetchOnWindowFocus: import.meta.env.PROD, // Only refetch on window focus in production
      retry: import.meta.env.PROD ? 2 : 1, // More retries in production
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff with max 30s
    },
    mutations: {
      retry: import.meta.env.PROD ? 1 : 0, // Retry mutations in production
      networkMode: 'always',
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
                  <Route path="team" element={<Team />} />
                  <Route path="opportunities" element={<Opportunities />} />
                  <Route path="reports" element={<Reports />} />
                  
                  {/* Leaderboard Routes */}
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="leaderboard/points" element={<PointsLeaderboard />} />
                  <Route path="leaderboard/sales" element={<SalesLeaderboard />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="commission" element={<AdminCommission />} />
                  <Route path="commission/approvals" element={<AdminCommissionApproval />} />
                  <Route path="commission/approvals/:id" element={<AdminCommissionApproval />} />
                  <Route path="commissions" element={<AdminCommissionApproval />} />
                  <Route path="commissions/:id" element={<AdminCommissionApproval />} />
                  <Route path="commission/settings" element={<CommissionSettings />} />
                  <Route path="commission/tiers" element={<CommissionTiers />} />
                  <Route path="commission/schedules" element={<PaymentSchedulesAdmin />} />
                  <Route path="commission/forecast" element={<CommissionForecastPage />} />
                  <Route path="agents" element={<AdminAgents />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="properties/:id" element={<AdminPropertyDetail />} />
                  
                  {/* System Routes */}
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="roles" element={<Roles />} />
                  <Route path="system-logs" element={<SystemLogs />} />
                  <Route path="database" element={<Database />} />
                  
                  {/* Reports Routes */}
                  <Route path="reports/overview" element={<Reports />} />
                  <Route path="reports/performance" element={<Reports />} />
                  <Route path="reports/sales" element={<Reports />} />
                  <Route path="reports/custom" element={<Reports />} />
                </Route>
                
                {/* Root redirects based on role */}
                <Route path="/admin-redirect" element={<Navigate to="/admin" replace />} />
                <Route path="/agent-redirect" element={<Navigate to="/dashboard" replace />} />
                
                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Toaster is now in main.tsx */}
            </NotificationProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
