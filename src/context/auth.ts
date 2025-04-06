
// This is a compatibility file that re-exports all auth components and hooks
export * from './auth/index';
export { default as AuthProvider } from './auth/AuthProvider';
export { useAuthContext as useAuth } from './auth/AuthContext';
