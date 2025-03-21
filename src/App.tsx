
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './providers/AuthProvider';

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
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import NewProperty from './pages/NewProperty';
import Profile from './pages/Profile';
import Index from './pages/Index';

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
                <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/transactions" element={<MainLayout><Transactions /></MainLayout>} />
                <Route path="/transactions/:id" element={<MainLayout><TransactionDetail /></MainLayout>} />
                <Route path="/transactions/new" element={<MainLayout><NewTransaction /></MainLayout>} />
                <Route path="/agents" element={<MainLayout><Agents /></MainLayout>} />
                <Route path="/agents/:id" element={<MainLayout><AgentDetail /></MainLayout>} />
                <Route path="/agents/new" element={<MainLayout><NewAgent /></MainLayout>} />
                <Route path="/commission" element={<MainLayout><Commission /></MainLayout>} />
                <Route path="/properties" element={<MainLayout><Properties /></MainLayout>} />
                <Route path="/properties/:id" element={<MainLayout><PropertyDetail /></MainLayout>} />
                <Route path="/properties/new" element={<MainLayout><NewProperty /></MainLayout>} />
                <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
                <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<Navigate to="/admin/commission" replace />} />
                <Route path="/admin/commission" element={<AdminLayout><AdminCommission /></AdminLayout>} />
                <Route path="/admin/commission/approvals" element={<AdminLayout><AdminCommissionApproval /></AdminLayout>} />
                <Route path="/admin/commission/approvals/:id" element={<AdminLayout><AdminCommissionApproval /></AdminLayout>} />
                <Route path="/admin/agents" element={<AdminLayout><AdminAgents /></AdminLayout>} />
                <Route path="/admin/transactions" element={<AdminLayout><AdminTransactions /></AdminLayout>} />
                <Route path="/admin/properties" element={<AdminLayout><AdminProperties /></AdminLayout>} />
                <Route path="/admin/properties/:id" element={<AdminLayout><AdminPropertyDetail /></AdminLayout>} />
                
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
