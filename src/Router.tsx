
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
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

// Create our router
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'properties', element: <PropertyList /> },
      { path: 'properties/:id', element: <PropertyDetail /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'team', element: <Team /> },
      { path: 'commission', element: <Commission /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
