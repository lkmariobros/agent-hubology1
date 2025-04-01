
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Team from './pages/Team';
import Commission from './pages/Commission';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAgents from './pages/admin/Agents';
import AdminProperties from './pages/admin/Properties';
import CommissionTiers from './pages/admin/CommissionTiers';
import PaymentSchedulesAdmin from './pages/admin/PaymentSchedulesAdmin';
import CommissionApproval from './pages/admin/CommissionApproval';
import CommissionForecast from './pages/admin/CommissionForecast';
import CommissionSettings from './pages/admin/CommissionSettings';
import NewTransaction from './pages/NewTransaction';
import TransactionList from './pages/TransactionList';
import TransactionDetail from './pages/TransactionDetail';
import { AuthProvider } from './providers/AuthProvider';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'properties', element: <PropertyList /> },
      { path: 'properties/:id', element: <PropertyDetail /> },
      { path: 'team', element: <Team /> },
      { path: 'transactions', element: <TransactionList /> },
      { path: 'transactions/new', element: <NewTransaction /> },
      { path: 'transactions/:id', element: <TransactionDetail /> },
      { path: 'commission', element: <Commission /> },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'agents', element: <AdminAgents /> },
          { path: 'properties', element: <AdminProperties /> },
          { path: 'commission/tiers', element: <CommissionTiers /> },
          { path: 'commission/schedules', element: <PaymentSchedulesAdmin /> },
          { path: 'commission/settings', element: <CommissionSettings /> },
          { path: 'commission/forecast', element: <CommissionForecast /> },
          { path: 'commissions', element: <CommissionApproval /> },
          { path: 'commissions/:id', element: <CommissionApproval /> },
        ],
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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
