# Clerk JWT Template Configuration for Supabase

This document provides the exact configuration needed for your Clerk JWT template to work with our standardized Supabase implementation.

## JWT Template Configuration

1. Go to your Clerk dashboard at [https://dashboard.clerk.dev/](https://dashboard.clerk.dev/)
2. Select your application
3. Navigate to **JWT Templates** in the left sidebar
4. If you have an existing "supabase" template, edit it. Otherwise, create a new template named "supabase"

## Required Template Content

Use the following JSON for your JWT template:

```json
{
  "user_id": "{{user.id}}",
  "user_email": "{{user.primary_email_address}}",
  "role": "authenticated",
  "aud": "authenticated"
}
```

## Important Notes

1. The `user_id` claim is critical for our RLS policies, which use `auth.jwt() ->> 'user_id'`
2. The `user_email` claim is used for various email-based operations
3. The `role` claim indicates the authentication status
4. The `aud` (audience) claim is required by Supabase to recognize the token

## How to Test Your Configuration

After setting up the template, use the `/basic-auth-test` route in our application to verify that:

1. You can sign in with Clerk
2. You can generate a JWT token
3. You can use the token to authenticate with Supabase
4. The JWT claims are correctly recognized by our database functions

If the test page shows all green checkmarks, your JWT template is configured correctly.

## Troubleshooting

If you encounter issues:

1. **JWT Not Working**: Check that the template name is exactly "supabase" (case-sensitive)
2. **Claims Not Found**: Verify that the template JSON matches exactly what's provided above
3. **Auth Failures**: Ensure the token is being passed to Supabase correctly in the Authorization header

For more details on how our authentication works, see the [CLERK_SUPABASE_DIRECT_INTEGRATION.md](./CLERK_SUPABASE_DIRECT_INTEGRATION.md) file.