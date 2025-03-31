import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import PropertyDetail from '@/pages/PropertyDetail';
import Transactions from '@/pages/Transactions';
import Commission from '@/pages/Commission';
import PaymentSchedules from '@/pages/PaymentSchedules';
import NewTransaction from '@/pages/NewTransaction';
import TransactionDetail from '@/pages/TransactionDetail';
import CommissionApproval from '@/pages/admin/CommissionApproval';
import NotFound from '@/pages/NotFound';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';
import { LoadingPage } from '@/components/ui/loading';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/providers/AuthProvider';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="properties"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <Properties />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="properties/:id"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <PropertyDetail />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <Transactions />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions/new"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <NewTransaction />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions/:id"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <TransactionDetail />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="commission"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <Commission />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="schedules"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <PaymentSchedules />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route
              path="commission-approval"
              element={
                <AdminRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <CommissionApproval />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="commission-approval/:id"
              element={
                <AdminRoute>
                  <Suspense fallback={<LoadingPage />}>
                    <CommissionApproval />
                  </Suspense>
                </AdminRoute>
              }
            />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
