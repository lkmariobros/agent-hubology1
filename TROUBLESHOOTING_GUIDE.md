# Troubleshooting Guide for Clerk and Supabase Integration

This guide helps you troubleshoot issues with the Clerk and Supabase integration.

## Current Status

We've made progress! The JWT token is now being generated correctly by Clerk, and we're using a direct token approach to authenticate with Supabase. However, there might still be issues with the database setup.

## Step 1: Run the Fixed SQL Script

1. Go to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Go to the SQL Editor
4. Run the `SUPABASE_DIRECT_SETUP_FIXED.sql` script

This script:
- Creates the `profiles` table if it doesn't exist
- Drops existing policies to avoid conflicts
- Creates new policies that allow authenticated users to access the profiles table
- Grants necessary permissions

## Step 2: Check the JWT Test Page

1. Go to the JWT Test page (`/jwt-test`)
2. Click "Test Again" to see if the Supabase session is now working
3. Check the browser console (F12) for detailed logs

Look for these key messages in the console:
- "Profiles table exists and is accessible"
- "Query successful with token"
- "Insert successful with token"

## Step 3: Check the Database Directly

1. Go to your Supabase dashboard
2. Go to the "Table Editor"
3. Check if the `profiles` table exists
4. If it exists, check if it has the correct columns:
   - `id` (UUID)
   - `clerk_id` (TEXT)
   - `email` (TEXT)
   - `first_name` (TEXT)
   - `last_name` (TEXT)
   - `role` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## Step 4: Check Row Level Security (RLS)

1. Go to your Supabase dashboard
2. Go to "Authentication" > "Policies"
3. Check if the `profiles` table has these policies:
   - "Users can view their own profile"
   - "Users can insert their own profile"
   - "Users can update their own profile"

## Step 5: Try the Profile Setup Page

After verifying the database setup:
1. Go to the profile setup page
2. Fill in the form and submit
3. Check the browser console for any errors

## Common Issues and Solutions

### "Query error: failed to parse select parameter"

This error occurs when there's an issue with the SQL query syntax. We've fixed this by updating the query in the JwtTest component.

### "Auth session missing!"

This error occurs when Supabase can't authenticate with the JWT token. We've fixed this by using a direct token approach.

### "relation 'profiles' does not exist"

This error occurs when the `profiles` table doesn't exist in the database. Run the SQL script to create the table.

### "permission denied for table profiles"

This error occurs when the RLS policies are not set up correctly. Run the SQL script to set up the policies.

## Next Steps

If you're still having issues:
1. Check the browser console for specific error messages
2. Make sure the SQL script ran successfully
3. Try creating a profile directly in the Supabase Table Editor
4. Check if the JWT token is being generated correctly
