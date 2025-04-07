# Supabase Setup Guide for Agent Hubology

This guide will help you set up a fresh Supabase project for your Agent Hubology application, which includes both Agent and Admin portals.

## 1. Create a New Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Click "New Project" and follow the setup wizard
3. Choose a name for your project (e.g., "agent-hubology")
4. Set a secure database password (save this somewhere safe)
5. Choose the region closest to your users
6. Click "Create new project"

## 2. Get Your Supabase Credentials

1. In the Supabase dashboard, go to Project Settings > API
2. Copy the following values:
   - **Project URL**: This will be your `VITE_SUPABASE_URL`
   - **anon/public key**: This will be your `VITE_SUPABASE_ANON_KEY`

## 3. Set Up Environment Variables

1. Create a `.env` file in your project root
2. Add the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_USE_REAL_DATA=true
   ```
3. Replace the placeholder values with your actual Supabase credentials

## 4. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of the `supabase-setup.sql` file from this project
3. Paste it into the SQL Editor and run the query
4. This will create:
   - A profiles table for user information
   - An agents table for agent-specific data
   - An admins table for admin-specific data
   - Row-Level Security policies to control access
   - Functions to manage user roles

## 5. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Under "Email Auth", make sure "Enable Email Signup" is turned on
3. Configure other authentication settings as needed:
   - Disable "Confirm email" for development (optional)
   - Set up password recovery
   - Configure redirect URLs

## 6. Create Test Users

For testing purposes, create some test users:

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User"
3. Create an agent user:
   - Email: agent@example.com
   - Password: (create a secure password)
4. Create an admin user:
   - Email: admin@example.com
   - Password: (create a secure password)
5. Promote the admin user by running this SQL:
   ```sql
   SELECT promote_to_admin('admin@example.com');
   ```

## 7. Test Your Connection

1. Start your development server:
   ```
   npm run dev
   ```
2. Try logging in with your test users
3. Verify that the agent user can only access the Agent Portal
4. Verify that the admin user can access both Agent and Admin Portals

## Troubleshooting

- **Authentication Issues**: Check browser console for error messages
- **Database Errors**: Verify your SQL setup in the Supabase dashboard
- **Environment Variables**: Make sure your `.env` file is correctly set up
- **CORS Errors**: Configure allowed origins in Supabase Auth settings

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
