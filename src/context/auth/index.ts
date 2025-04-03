
export * from './AuthContext';
export * from './authUtils';
export * from './authService';
export * from './roleUtils';
export * from './useAuthState';

// Re-export the auth hook for convenience
export { useAuthContext } from './AuthContext';

// Export the AuthProvider with a clean approach
export { default as AuthProvider } from './AuthProvider';
