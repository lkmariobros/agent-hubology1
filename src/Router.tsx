
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Transactions from './pages/Transactions';
import Team from './pages/Team';
import Commission from './pages/Commission';
import Leaderboard from './pages/Leaderboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard';
import Index from './pages/Index';
import { AuthProvider } from './context/auth';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create our router with proper route structure and authentication
const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  
  // Agent portal (protected routes)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'properties', element: <PropertyList /> },
      { path: 'properties/:id', element: <PropertyDetail /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'team', element: <Team /> },
      { path: 'commission', element: <Commission /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  
  // Admin portal (protected routes)
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      // Add other admin routes here as needed
    ],
  },
  
  // Catch-all route for 404
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
}
