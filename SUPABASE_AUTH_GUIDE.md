# Supabase Authentication Guide for Agent Hubology

This guide explains how to implement and use authentication with Supabase in your Agent Hubology application.

## Environment Setup

1. Create a `.env` file in your project root with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_USE_REAL_DATA=true
   ```

2. Replace `your_supabase_project_url` and `your_supabase_anon_key` with values from your Supabase dashboard (Project Settings > API).

## Authentication Flow

The application already has authentication set up with the following features:

- Sign up with email and password
- Sign in with email and password
- Password reset functionality
- Role-based access control (Agent vs Admin)

## Role-Based Access

The application supports two roles:
- **Agent**: Regular users who can access the Agent Portal
- **Admin**: Administrators who can access both Agent Portal and Admin Portal

### How Roles Work

1. When a user signs up, they are assigned the 'agent' role by default
2. Admins can promote users to the 'admin' role through the Admin Portal
3. The application checks the user's role to determine which features they can access

## Using Authentication in Components

To access authentication in your components:

```tsx
import { useAuth } from '@/context/auth';

function MyComponent() {
  const { 
    user,           // Current user object
    isAuthenticated, // Boolean indicating if user is logged in
    isAdmin,        // Boolean indicating if user has admin role
    signIn,         // Function to sign in
    signOut,        // Function to sign out
    hasRole         // Function to check if user has a specific role
  } = useAuth();
  
  // Example usage
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  if (isAdmin) {
    return <AdminDashboard />;
  }
  
  return <AgentDashboard />;
}
```

## Protecting Routes

Use the `ProtectedRoute` component to restrict access to authenticated users or users with specific roles:

```tsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/agent" 
  element={
    <ProtectedRoute>
      <AgentDashboard />
    </ProtectedRoute>
  } 
/>
```

## Testing Authentication

For testing purposes, you can create test users in the Supabase dashboard:

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User"
3. Enter email and password
4. After creating the user, go to your SQL Editor and run:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'admin@example.com';
   ```
   to promote a user to admin

## Troubleshooting

- **Session not persisting**: Make sure localStorage is available and not blocked
- **Role changes not reflected**: The user might need to sign out and sign back in
- **Authentication errors**: Check browser console for specific error messages
