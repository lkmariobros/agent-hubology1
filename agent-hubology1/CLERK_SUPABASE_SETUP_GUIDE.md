# Complete Clerk and Supabase Integration Guide

This guide provides step-by-step instructions for integrating Clerk authentication with Supabase in your application.

## Step 1: Set Up Clerk JWT Template

1. Go to your Clerk dashboard at https://dashboard.clerk.dev/
2. Select your application
3. Go to "JWT Templates" in the left sidebar
4. Click "New template"
5. Name it "supabase"
6. Use this template:

```json
{
  "aud": "authenticated",
  "role": "authenticated",
  "user_id": "{{user.id}}",
  "user_email": "{{user.primary_email_address}}"
}
```

7. Leave "Use custom signing key" turned OFF
8. Click "Create"

## Step 2: Set Up Supabase Database

1. Go to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Go to the SQL Editor
4. Create a new query
5. Copy and paste the contents of the `supabase-clerk-setup-fixed.sql` file
6. Run the SQL script

This script will:
- Create the `profiles` table with a `clerk_id` column
- Set up Row Level Security (RLS) policies
- Create helper functions for managing user profiles and roles

## Step 3: Fix the ClerkProvider Component

The ClerkProvider component had a naming conflict with `useClerkAuth`. We've fixed this by:

1. Changing the import name to `useClerkAuthOriginal`
2. Updating the reference in the component
3. Keeping the exported hook name the same

## Step 4: Update the ProfileSetup Component

We've enhanced the ProfileSetup component to:

1. Check if a profile already exists
2. Show loading states
3. Create a profile using direct Supabase calls
4. Handle errors properly

## Step 5: Test the Integration

1. Start your application
2. Sign in with Clerk
3. You should be redirected to the profile setup page if you don't have a profile
4. Complete the profile setup form
5. You should be redirected to the dashboard or admin dashboard based on your role

## Troubleshooting

### JWT Template Issues

If you see errors related to JWT claims:
- Make sure you're not using reserved claims like `sub`, `iss`, `exp`, or `iat`
- Use custom claims like `user_id` and `user_email` instead
- Check the browser console for JWT-related errors

### Supabase Connection Issues

If you can't connect to Supabase:
- Check the browser console for errors
- Make sure the JWT token is being generated correctly
- Verify that the token is being set in Supabase with `supabase.auth.setSession()`

### Profile Creation Issues

If profiles aren't being created:
- Check the browser console for errors when calling the `create_profile_for_clerk_user` function
- Verify that the `profiles` table has been created with the `clerk_id` column
- Check the Supabase logs for any SQL errors

### RLS Policy Issues

If you're getting permission errors:
- Make sure the RLS policies are using `auth.jwt() ->> 'user_id'` to get the Clerk user ID
- Verify that the policies are correctly applied to the tables
- Check if the user has the appropriate role in the `profiles` table

## Next Steps

Once the basic integration is working, you can:

1. Add more fields to the `profiles` table
2. Create more complex role-based access control
3. Set up additional tables for your application's data
4. Create more helper functions for common operations

## Code Reference

### Getting a JWT Token from Clerk

```typescript
const token = await getToken({ template: 'supabase' });
```

### Setting the Token in Supabase

```typescript
const { data, error } = await supabase.auth.setSession({ 
  access_token: token, 
  refresh_token: '' 
});
```

### Creating a Profile

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

### Checking if a Profile Exists

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('clerk_id', user.id)
  .maybeSingle();
```

### Getting the Current User's Profile

```typescript
const { data, error } = await supabase
  .rpc('get_my_profile');
```
