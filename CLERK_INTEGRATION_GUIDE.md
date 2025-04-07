# Clerk Integration Guide for Agent Hubology

This guide explains how to use Clerk authentication with your Agent Hubology application.

## Overview

Clerk is a complete authentication and user management solution that provides:
- Pre-built UI components for sign-in, sign-up, and user profile management
- Social login providers (Google, GitHub, etc.)
- Multi-factor authentication
- User management dashboard
- JWT tokens for secure API access

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @clerk/clerk-react
```

### 2. Switch to Clerk Authentication

Run the provided script to switch from Supabase Auth to Clerk:

```bash
./switch-to-clerk.bat
```

This script will:
- Copy the Clerk-specific files to the correct locations
- Create a `.env` file with the necessary environment variables
- Set up compatibility layers for existing code

### 3. Run the Application

```bash
npm run dev
```

Visit http://localhost:3000 to see the application with Clerk authentication.

## How It Works

### Authentication Flow

1. Users sign in or sign up using Clerk's components
2. Clerk generates a JWT token
3. The token is sent to Supabase for database access
4. Row Level Security (RLS) policies in Supabase use the token to control access

### User Profiles

When a user signs up with Clerk, they need to create a profile in Supabase:

1. User signs up with Clerk
2. User is redirected to the profile setup page
3. User selects their role (agent or admin)
4. A profile is created in the Supabase `profiles` table
5. User is redirected to the appropriate dashboard

### Role-Based Access

The application supports two roles:
- **Agent**: Regular users who can access the agent portal
- **Admin**: Users who can access the admin portal

Users can switch between roles if they have both permissions.

## Customization

### Clerk Dashboard

You can customize the Clerk authentication experience from the Clerk dashboard:
- https://dashboard.clerk.dev/

### Environment Variables

Configure Clerk with these environment variables:
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

## Troubleshooting

### Common Issues

1. **Authentication doesn't work**
   - Check that your Clerk publishable key is correct
   - Make sure the Supabase JWT template is configured correctly

2. **Can't access protected routes**
   - Verify that the user has a profile in the Supabase `profiles` table
   - Check that the user has the correct role assigned

3. **JWT token issues**
   - Ensure the Clerk JWT template matches what Supabase expects
   - Check the Supabase RLS policies to make sure they use `auth.jwt() ->> 'sub'`

## Additional Resources

- [Clerk Documentation](https://clerk.dev/docs)
- [Supabase JWT Authentication](https://supabase.com/docs/guides/auth/auth-jwt)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
