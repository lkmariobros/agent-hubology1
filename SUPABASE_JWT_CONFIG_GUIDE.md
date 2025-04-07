# Supabase JWT Configuration Guide for Clerk Integration

This guide explains how to configure Supabase to work with Clerk JWT tokens.

## Step 1: Access Supabase Project Settings

1. Go to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Click on "Project Settings" in the left sidebar
4. Go to the "API" tab

## Step 2: Configure JWT Settings

In the API settings page, scroll down to the "JWT Settings" section:

1. **JWT Secret**:
   - For development, you can leave this as is (Supabase manages the JWT secret)
   - For production, you might need to set a custom secret that matches your Clerk JWT secret

2. **JWT Expiry**:
   - Set this to a reasonable value like 3600 (1 hour)
   - This should match or be less than your Clerk JWT expiry

## Step 3: Configure Auth Providers

In the same API settings page, find the "Auth Providers" section:

1. Scroll to the "External OAuth Providers" section
2. Make sure "Enable Sign in with JWT" is turned ON

## Step 4: Run the SQL Fix Script

After configuring the JWT settings, you need to update your SQL functions to use the `sub` claim:

1. Go to the SQL Editor in your Supabase dashboard
2. Run the `supabase-clerk-jwt-fix.sql` script we created earlier

This script updates all your functions and policies to use `auth.jwt() ->> 'sub'` instead of `auth.jwt() ->> 'user_id'`.

## Step 5: Test the Integration

After making these changes:

1. Go to the JWT Test page in your application (`/jwt-test`)
2. Click "Test Again" to see if the Supabase session is now working
3. If successful, you should see the Supabase session information displayed

## Troubleshooting

If you're still having issues:

1. **Check JWT Claims**:
   - Make sure your Clerk JWT template includes `aud`, `role`, and `sub` claims
   - The `sub` claim should be automatically included by Clerk

2. **Check Supabase Logs**:
   - Go to the "Logs" section in your Supabase dashboard
   - Look for any authentication errors

3. **Try Direct Database Access**:
   - Use the "Table Editor" in Supabase to directly view and edit the `profiles` table
   - Check if the `clerk_id` column exists and has the correct values

4. **Check RLS Policies**:
   - Go to the "Authentication" > "Policies" section in Supabase
   - Make sure the policies for the `profiles` table are using `auth.jwt() ->> 'sub'`

## Important Notes

1. **Clerk User ID Format**:
   - Clerk user IDs are in the format `user_2vDetK6IaDSebrZHU74oqE4obts`
   - Make sure your `clerk_id` column in the `profiles` table can store this format (TEXT type)

2. **JWT Verification**:
   - Supabase verifies the JWT signature using the JWT secret
   - Make sure the JWT is not expired (check the `exp` claim)

3. **RLS Policies**:
   - Row Level Security (RLS) policies use the JWT claims to determine access
   - The `sub` claim is used to identify the user
