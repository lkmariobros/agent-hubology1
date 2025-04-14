# Supabase Clerk Setup Guide

This guide explains how to set up your Supabase database to work with Clerk authentication.

## Step 1: Access the SQL Editor

1. Go to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New query" to create a new SQL query

## Step 2: Run the Setup Script

1. Open the `supabase-clerk-setup.sql` file in your project
2. Copy all the SQL code from this file
3. Paste it into the SQL Editor in Supabase
4. Click "Run" to execute the script

This script will:
- Create a `profiles` table that links to Clerk users via `clerk_id`
- Set up Row Level Security (RLS) policies for Clerk JWT authentication
- Create helper functions for managing user profiles and roles
- Create tables for agent and admin data

## Step 3: Verify the Setup

After running the script, you should see these tables in your database:
- `profiles`: Stores user profile information
- `agents`: Stores agent-specific data
- `admins`: Stores admin-specific data

You should also see these functions:
- `create_profile_for_clerk_user`: Creates a profile for a Clerk user
- `get_my_profile`: Gets the current user's profile
- `user_has_role`: Checks if a user has a specific role
- `is_admin`: Checks if the current user is an admin
- `promote_to_admin`: Promotes a user to admin
- `demote_to_agent`: Demotes an admin to agent

## Step 4: Configure Clerk JWT Template

To make Clerk work with Supabase, you need to set up a JWT template in Clerk:

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

## Step 5: Test the Integration

To test if the integration is working:

1. Sign in to your application using Clerk
2. Complete the profile setup form
3. Check the `profiles` table in Supabase to see if a new profile was created
4. Try accessing protected routes to see if the role-based access control is working

## Troubleshooting

If you encounter issues:

1. **Profile not being created**: Check the browser console for errors when calling the `create_profile_for_clerk_user` function.

2. **Authentication issues**: Make sure the Clerk JWT template is configured correctly and that the `sub` claim matches the `clerk_id` field in the `profiles` table.

3. **Role-based access control not working**: Check if the `user_has_role` function is being called correctly and that the user has the appropriate role in the `profiles` table.

4. **Database errors**: Look at the Supabase logs for any SQL errors that might be occurring.

## Next Steps

Once the basic integration is working, you can:

1. Add more fields to the `profiles` table
2. Create more complex role-based access control
3. Set up additional tables for your application's data
4. Create more helper functions for common operations
