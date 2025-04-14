# Clerk and Supabase Integration Guide

This guide explains how to integrate Clerk authentication with Supabase in your Agent Hubology application.

## Overview

The integration involves:
1. Setting up Clerk for authentication
2. Configuring Supabase to work with Clerk's JWT tokens
3. Creating user profiles in Supabase when users sign up with Clerk
4. Implementing role-based access control

## Step 1: Set Up Supabase Database

First, you need to set up your Supabase database to work with Clerk:

1. Go to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Go to the SQL Editor
4. Run the `supabase-clerk-setup.sql` script

This script creates:
- A `profiles` table that links to Clerk users via `clerk_id`
- Row Level Security (RLS) policies for Clerk JWT authentication
- Helper functions for managing user profiles and roles
- Tables for agent and admin data

## Step 2: Configure Clerk JWT Template

To make Clerk work with Supabase, you need to set up a JWT template:

1. Go to your Clerk dashboard at https://dashboard.clerk.dev/
2. Select your application
3. Go to "JWT Templates" in the left sidebar
4. Click "New template"
5. Name it "supabase"
6. Use this template:

```json
{
  "sub": "{{user.id}}",
  "aud": "authenticated",
  "role": "authenticated",
  "iss": "https://api.clerk.dev/v1/",
  "exp": "{{exp}}",
  "iat": "{{iat}}"
}
```

7. Click "Create"

## Step 3: Update Your Application Code

Your application needs to:

1. **Get a JWT token from Clerk**:
```typescript
const token = await getToken({ template: 'supabase' });
```

2. **Set the token in Supabase**:
```typescript
supabase.auth.setSession({ access_token: token, refresh_token: '' });
```

3. **Create a profile for new users**:
```typescript
const { data, error } = await supabase
  .rpc('create_profile_for_clerk_user', {
    p_clerk_id: user.id,
    p_email: user.primaryEmailAddress?.emailAddress || '',
    p_first_name: user.firstName || '',
    p_last_name: user.lastName || '',
    p_role: role
  });
```

4. **Check if a user has a profile**:
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('clerk_id', user.id)
  .maybeSingle();
```

5. **Get the current user's profile**:
```typescript
const { data, error } = await supabase
  .rpc('get_my_profile');
```

## Step 4: Implement Role-Based Access Control

Your application uses these functions for role-based access control:

1. **Check if a user has a specific role**:
```typescript
const { data, error } = await supabase
  .rpc('user_has_role', { required_role: 'admin' });
```

2. **Promote a user to admin**:
```typescript
const { data, error } = await supabase
  .rpc('promote_to_admin', { user_email: email });
```

3. **Demote an admin to agent**:
```typescript
const { data, error } = await supabase
  .rpc('demote_to_agent', { user_email: email });
```

## Step 5: Set Up Protected Routes

Your application should:

1. Check if a user is authenticated with Clerk
2. Check if the user has a profile in Supabase
3. Redirect to the profile setup page if they don't have a profile
4. Check if the user has the required role for protected routes

Example:
```typescript
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [hasProfile, setHasProfile] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  
  // Check if user has a profile and the required role
  useEffect(() => {
    const checkAccess = async () => {
      if (!isSignedIn || !user) return;
      
      // Get token for Supabase
      const token = await getToken({ template: 'supabase' });
      
      // Set the auth token for Supabase
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      
      // Check if profile exists
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', user.id)
        .maybeSingle();
      
      setHasProfile(!!data);
      
      // Check if user has required role
      if (requireAdmin && data) {
        const { data: isAdmin } = await supabase
          .rpc('user_has_role', { required_role: 'admin' });
        
        setHasRequiredRole(!!isAdmin);
      } else {
        setHasRequiredRole(true);
      }
    };
    
    checkAccess();
  }, [isSignedIn, user, requireAdmin, getToken]);
  
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  
  if (!hasProfile) {
    return <Navigate to="/profile/setup" replace />;
  }
  
  if (requireAdmin && !hasRequiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
```

## Step 6: Test the Integration

To test if the integration is working:

1. Sign in to your application using Clerk
2. Complete the profile setup form
3. Check the `profiles` table in Supabase to see if a new profile was created
4. Try accessing protected routes to see if the role-based access control is working

## Troubleshooting

If you encounter issues:

1. **JWT token issues**:
   - Check the Clerk JWT template
   - Make sure the `sub` claim matches the `clerk_id` field in the `profiles` table
   - Check the browser console for JWT-related errors

2. **Profile creation issues**:
   - Check the browser console for errors when calling the `create_profile_for_clerk_user` function
   - Check the Supabase logs for any SQL errors

3. **Role-based access control issues**:
   - Check if the `user_has_role` function is being called correctly
   - Check if the user has the appropriate role in the `profiles` table

4. **RLS policy issues**:
   - Make sure the RLS policies are using `auth.jwt() ->> 'sub'` to get the Clerk user ID
   - Check if the policies are correctly applied to the tables

## Next Steps

Once the basic integration is working, you can:

1. Add more fields to the `profiles` table
2. Create more complex role-based access control
3. Set up additional tables for your application's data
4. Create more helper functions for common operations
