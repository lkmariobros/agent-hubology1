# Clerk and Supabase Direct Integration Guide

This guide explains how to integrate Clerk authentication with Supabase using a direct token approach.

## The Problem

When using Clerk with Supabase, there are two main approaches:

1. **JWT Template Approach**: Configure Clerk to generate JWTs that Supabase can verify
2. **Direct Token Approach**: Use Clerk's JWT directly in Supabase API calls

We've implemented the second approach because it's more reliable and doesn't require complex JWT configuration.

## Step 1: Set Up the Supabase Database

1. Go to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Go to the SQL Editor
4. Run the `SUPABASE_DIRECT_SETUP.sql` script

This script:
- Creates the `profiles` table with a `clerk_id` column
- Enables Row Level Security (RLS)
- Creates policies that allow authenticated users to access the profiles table
- Grants necessary permissions

## Step 2: Use the Direct Token Approach in Your Code

We've implemented a function called `createSupabaseWithToken` that creates a Supabase client with a JWT token:

```typescript
export const createSupabaseWithToken = (jwt: string): SupabaseClient => {
  return createClient(
    SUPABASE_API_URL,
    SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};
```

This function is used in the ProfileSetup component to:
1. Get a JWT token from Clerk
2. Create a Supabase client with the token
3. Use the client to interact with the database

## Step 3: Test the Integration

1. Go to the JWT Test page (`/jwt-test`)
2. Check if the Supabase session is working
3. If successful, you should see the Supabase session information displayed

## Step 4: Use the Profile Setup Page

After verifying the JWT integration, try the profile setup page:
1. Sign in with Clerk
2. You should be redirected to the profile setup page
3. Fill in the form and submit
4. You should be redirected to the dashboard

## How It Works

1. When a user signs in with Clerk, we get a JWT token
2. We create a Supabase client with the token in the Authorization header
3. We use this client to interact with the database
4. The token is used to authenticate the user for each request

This approach bypasses the need for complex JWT configuration and is more reliable.

## Troubleshooting

If you're still having issues:

1. **Check the JWT Token**:
   - Go to the JWT Test page (`/jwt-test`)
   - Make sure the token is being generated correctly

2. **Check the Database**:
   - Make sure the `profiles` table exists
   - Make sure the RLS policies are set up correctly

3. **Check the Browser Console**:
   - Look for any error messages related to Supabase or JWT

4. **Try Direct Database Access**:
   - Use the Table Editor in Supabase to directly view and edit the `profiles` table
