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
import NewProperty from './pages/NewProperty';
import Leaderboard from './pages/leaderboard/Leaderboard';
import PointsLeaderboard from './pages/leaderboard/Points';
import SalesLeaderboard from './pages/leaderboard/Sales';
import Opportunities from './pages/Opportunities';
import PropertySettings from './pages/PropertySettings';

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
        path: 'properties/new', 
        element: <ProtectedRoute><NewProperty /></ProtectedRoute> 
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
      { 
        path: 'opportunities', 
        element: <ProtectedRoute><Opportunities /></ProtectedRoute> 
      },
      { 
        path: 'reports', 
        element: <ProtectedRoute><Reports /></ProtectedRoute> 
      },
      { 
        path: 'leaderboard', 
        element: <ProtectedRoute><Leaderboard /></ProtectedRoute> 
      },
      { 
        path: 'leaderboard/points', 
        element: <ProtectedRoute><PointsLeaderboard /></ProtectedRoute> 
      },
      { 
        path: 'leaderboard/sales', 
        element: <ProtectedRoute><SalesLeaderboard /></ProtectedRoute> 
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
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'agents', 
        element: <ProtectedRoute><AdminAgents /></ProtectedRoute> 
      },
      { 
        path: 'properties', 
        element: <ProtectedRoute><AdminProperties /></ProtectedRoute> 
      },
      { 
        path: 'transactions', 
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'commission/tiers', 
        element: <ProtectedRoute><CommissionTiers /></ProtectedRoute> 
      },
      { 
        path: 'commission/schedules', 
        element: <ProtectedRoute><PaymentSchedulesAdmin /></ProtectedRoute> 
      },
      { 
        path: 'commission/settings', 
        element: <ProtectedRoute><CommissionSettings /></ProtectedRoute> 
      },
      { 
        path: 'commission/forecast', 
        element: <ProtectedRoute><CommissionForecastPage /></ProtectedRoute> 
      },
      { 
        path: 'commissions', 
        element: <ProtectedRoute><CommissionApproval /></ProtectedRoute> 
      },
      { 
        path: 'commissions/:id', 
        element: <ProtectedRoute><CommissionApproval /></ProtectedRoute> 
      },
      { 
        path: 'roles', 
        element: <ProtectedRoute><Roles /></ProtectedRoute> 
      },
      { 
        path: 'settings', 
        element: <ProtectedRoute><AdminSettings /></ProtectedRoute> 
      },
      { 
        path: 'reports/overview', 
        element: <ProtectedRoute><Reports /></ProtectedRoute> 
      },
      { 
        path: 'reports/performance', 
        element: <ProtectedRoute><Reports /></ProtectedRoute> 
      },
      { 
        path: 'reports/sales', 
        element: <ProtectedRoute><Reports /></ProtectedRoute> 
      },
      { 
        path: 'reports/custom', 
        element: <ProtectedRoute><Reports /></ProtectedRoute> 
      },
      { 
        path: 'system-logs', 
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'database', 
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> 
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
