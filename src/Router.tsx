
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
import AdminTransactions from './pages/admin/Transactions';
import Index from './pages/Index';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Opportunities from './pages/Opportunities';
import Leaderboard from './pages/leaderboard/Leaderboard';
import PointsLeaderboard from './pages/leaderboard/Points';
import SalesLeaderboard from './pages/leaderboard/Sales';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import NewAgent from './pages/NewAgent';
import Properties from './pages/Properties';
import SystemLogs from './pages/admin/SystemLogs';
import Database from './pages/admin/Database';

// Merged router with all routes from both implementations
const router = createBrowserRouter([
  // Auth routes - outside of layouts
  { path: '/', element: <Index /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/invite', element: <Signup /> }, // Handle invitation links
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  
  // Agent portal routes
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    errorElement: <NotFound />,
    children: [
      { 
        index: true, 
        element: <Dashboard /> 
      },
      { 
        path: 'dashboard', 
        element: <Dashboard /> 
      },
      { 
        path: 'home', 
        element: <Home /> 
      },
      { 
        path: 'properties', 
        element: <Properties /> 
      },
      { 
        path: 'properties/:id', 
        element: <PropertyDetail /> 
      },
      { 
        path: 'properties/new', 
        element: <NewProperty /> 
      },
      { 
        path: 'team', 
        element: <Team /> 
      },
      { 
        path: 'transactions', 
        element: <TransactionList /> 
      },
      { 
        path: 'transactions/new', 
        element: <NewTransaction /> 
      },
      { 
        path: 'transactions/:id', 
        element: <TransactionDetail /> 
      },
      { 
        path: 'commission', 
        element: <Commission /> 
      },
      { 
        path: 'commission/forecast', 
        element: <CommissionForecast /> 
      },
      { 
        path: 'profile', 
        element: <Profile /> 
      },
      { 
        path: 'settings', 
        element: <Settings /> 
      },
      { 
        path: 'opportunities', 
        element: <Opportunities /> 
      },
      { 
        path: 'agents', 
        element: <Agents /> 
      },
      { 
        path: 'agents/:id', 
        element: <AgentDetail /> 
      },
      { 
        path: 'agents/new', 
        element: <NewAgent /> 
      },
      { 
        path: 'reports', 
        element: <Reports /> 
      },
      
      // Leaderboard Routes
      { 
        path: 'leaderboard', 
        element: <Leaderboard /> 
      },
      { 
        path: 'leaderboard/points', 
        element: <PointsLeaderboard /> 
      },
      { 
        path: 'leaderboard/sales', 
        element: <SalesLeaderboard /> 
      },
    ],
  },
  
  // Admin portal routes
  {
    path: '/admin',
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    errorElement: <NotFound />,
    children: [
      { 
        index: true, 
        element: <AdminDashboard /> 
      },
      { 
        path: 'dashboard', 
        element: <AdminDashboard /> 
      },
      { 
        path: 'agents', 
        element: <AdminAgents /> 
      },
      { 
        path: 'properties', 
        element: <AdminProperties /> 
      },
      { 
        path: 'transactions', 
        element: <AdminTransactions /> 
      },
      { 
        path: 'commission', 
        element: <CommissionApproval /> 
      },
      { 
        path: 'commission/tiers', 
        element: <CommissionTiers /> 
      },
      { 
        path: 'commission/schedules', 
        element: <PaymentSchedulesAdmin /> 
      },
      { 
        path: 'commission/settings', 
        element: <CommissionSettings /> 
      },
      { 
        path: 'commission/forecast', 
        element: <CommissionForecastPage /> 
      },
      { 
        path: 'commission/approvals', 
        element: <CommissionApproval /> 
      },
      { 
        path: 'commission/approvals/:id', 
        element: <CommissionApproval /> 
      },
      { 
        path: 'commissions', 
        element: <CommissionApproval /> 
      },
      { 
        path: 'commissions/:id', 
        element: <CommissionApproval /> 
      },
      { 
        path: 'roles', 
        element: <Roles /> 
      },
      { 
        path: 'settings', 
        element: <AdminSettings /> 
      },
      { 
        path: 'system-logs', 
        element: <SystemLogs /> 
      },
      { 
        path: 'database', 
        element: <Database /> 
      },
      { 
        path: 'reports/overview', 
        element: <Reports /> 
      },
      { 
        path: 'reports/performance', 
        element: <Reports /> 
      },
      { 
        path: 'reports/sales', 
        element: <Reports /> 
      },
      { 
        path: 'reports/custom', 
        element: <Reports /> 
      },
    ],
  },
  
  // Root redirects based on role
  { path: '/admin-redirect', element: <ProtectedRoute><Navigate to="/admin/dashboard" replace /></ProtectedRoute> },
  { path: '/agent-redirect', element: <ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute> },
  
  // Fallback
  { path: '*', element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
