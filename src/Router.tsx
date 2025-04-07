
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Team from './pages/Team';
import Commission from './pages/Commission';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAgents from './pages/admin/Agents';
import AdminProperties from './pages/admin/Properties';
import CommissionTiers from './pages/admin/CommissionTiers';
import PaymentSchedulesAdmin from './pages/admin/PaymentSchedulesAdmin';
import CommissionApproval from './pages/admin/CommissionApproval';
import CommissionForecast from './pages/CommissionForecast';
import CommissionSettings from './pages/admin/CommissionSettings';
import Roles from './pages/admin/Roles';
import NewTransaction from './pages/NewTransaction';
import TransactionList from './pages/TransactionList';
import TransactionDetail from './pages/TransactionDetail';
import { AuthProvider } from './providers/AuthProvider';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';
import CommissionForecastPage from './pages/admin/CommissionForecast';
import Reports from './pages/Reports';
import AdminSettings from './pages/admin/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider><AppLayout /></AuthProvider>,
    errorElement: <NotFound />,
    children: [
      { 
        index: true, 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
      },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
      },
      { 
        path: 'properties', 
        element: <ProtectedRoute><PropertyList /></ProtectedRoute> 
      },
      { 
        path: 'properties/:id', 
        element: <ProtectedRoute><PropertyDetail /></ProtectedRoute> 
      },
      { 
        path: 'team', 
        element: <ProtectedRoute><Team /></ProtectedRoute> 
      },
      { 
        path: 'transactions', 
        element: <ProtectedRoute><TransactionList /></ProtectedRoute> 
      },
      { 
        path: 'transactions/new', 
        element: <ProtectedRoute><NewTransaction /></ProtectedRoute> 
      },
      { 
        path: 'transactions/:id', 
        element: <ProtectedRoute><TransactionDetail /></ProtectedRoute> 
      },
      { 
        path: 'commission', 
        element: <ProtectedRoute><Commission /></ProtectedRoute> 
      },
      { 
        path: 'commission/forecast', 
        element: <ProtectedRoute><CommissionForecast /></ProtectedRoute> 
      },
    ],
  },
  {
    path: '/admin',
    element: <AuthProvider><AdminLayout /></AuthProvider>,
    errorElement: <NotFound />,
    children: [
      { 
        index: true, 
        element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'agents', 
        element: <ProtectedRoute requireAdmin={true}><AdminAgents /></ProtectedRoute> 
      },
      { 
        path: 'properties', 
        element: <ProtectedRoute requireAdmin={true}><AdminProperties /></ProtectedRoute> 
      },
      { 
        path: 'transactions', 
        element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'commission/tiers', 
        element: <ProtectedRoute requireAdmin={true}><CommissionTiers /></ProtectedRoute> 
      },
      { 
        path: 'commission/schedules', 
        element: <ProtectedRoute requireAdmin={true}><PaymentSchedulesAdmin /></ProtectedRoute> 
      },
      { 
        path: 'commission/settings', 
        element: <ProtectedRoute requireAdmin={true}><CommissionSettings /></ProtectedRoute> 
      },
      { 
        path: 'commission/forecast', 
        element: <ProtectedRoute requireAdmin={true}><CommissionForecastPage /></ProtectedRoute> 
      },
      { 
        path: 'commissions', 
        element: <ProtectedRoute requireAdmin={true}><CommissionApproval /></ProtectedRoute> 
      },
      { 
        path: 'commissions/:id', 
        element: <ProtectedRoute requireAdmin={true}><CommissionApproval /></ProtectedRoute> 
      },
      { 
        path: 'roles', 
        element: <ProtectedRoute requireAdmin={true}><Roles /></ProtectedRoute> 
      },
      { 
        path: 'settings', 
        element: <ProtectedRoute requireAdmin={true}><AdminSettings /></ProtectedRoute> 
      },
      { 
        path: 'reports/overview', 
        element: <ProtectedRoute requireAdmin={true}><Reports /></ProtectedRoute> 
      },
      { 
        path: 'reports/performance', 
        element: <ProtectedRoute requireAdmin={true}><Reports /></ProtectedRoute> 
      },
      { 
        path: 'reports/sales', 
        element: <ProtectedRoute requireAdmin={true}><Reports /></ProtectedRoute> 
      },
      { 
        path: 'reports/custom', 
        element: <ProtectedRoute requireAdmin={true}><Reports /></ProtectedRoute> 
      },
      { 
        path: 'system-logs', 
        element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'database', 
        element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> 
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '*', element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
