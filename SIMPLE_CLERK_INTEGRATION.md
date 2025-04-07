# Simple Clerk Integration Guide

This guide explains how to use the simplified Clerk authentication in your application.

## Overview

This is a simplified version of the Clerk integration that focuses on getting authentication working quickly without complex database integration. It provides:

- Sign-in and sign-up pages using Clerk's components
- Protected routes that require authentication
- User profile button for managing your account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @clerk/clerk-react
```

### 2. Switch to Simple Clerk Authentication

Run the provided script to switch to the simplified Clerk authentication:

```bash
./switch-to-simple-clerk.bat
```

This script will:
- Copy the simplified Clerk files to the correct locations
- Create a `.env` file with the necessary environment variables

### 3. Run the Application

```bash
npm run dev
```

Visit http://localhost:3000 to see the application with Clerk authentication.

## How It Works

### Authentication Flow

1. Users sign in or sign up using Clerk's components
2. Clerk handles all authentication logic
3. Protected routes check if the user is authenticated
4. The user profile button allows users to manage their account

### Protected Routes

The `SimpleProtectedRoute` component ensures that only authenticated users can access certain pages. If a user tries to access a protected page without being authenticated, they will be redirected to the sign-in page.

### User Profile

The user profile button in the header allows users to:
- View their profile information
- Manage their account settings
- Sign out

## Next Steps

Once you're comfortable with this simplified integration, you can:

1. Set up the Supabase database integration
2. Implement role-based access control
3. Add more advanced features like social login

## Troubleshooting

### Common Issues

1. **Authentication doesn't work**
   - Check that your Clerk publishable key is correct in the `.env` file
   - Make sure you've installed the Clerk package correctly

2. **Can't access protected routes**
   - Verify that you're signed in
   - Check the browser console for any errors

3. **Styling issues**
   - The Clerk components are styled to match your application's theme
   - You can customize the appearance in the ClerkProvider configuration
