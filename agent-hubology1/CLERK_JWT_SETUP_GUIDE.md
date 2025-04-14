# Clerk JWT Template Setup Guide

This guide explains how to set up a JWT template in Clerk for Supabase integration.

## Step 1: Access JWT Templates in Clerk

1. Go to your Clerk dashboard at https://dashboard.clerk.dev/
2. Select your application
3. Go to "JWT Templates" in the left sidebar
4. Click "New template"

## Step 2: Create the Supabase JWT Template

1. Name the template: `supabase`
2. Use the following JSON for the template:

```json
{
  "aud": "authenticated",
  "role": "authenticated",
  "user_id": "{{user.id}}",
  "user_email": "{{user.primary_email_address}}"
}
```

3. Leave "Use custom signing key" turned OFF
4. Click "Create"

## Step 3: Verify the Template

After creating the template, you should see it in your list of JWT templates. Make sure:

1. The template name is `supabase`
2. The template contains the correct claims
3. No errors are shown

## Important Notes

1. **Do not use reserved claims**: Clerk automatically manages reserved JWT claims like `sub`, `iss`, `exp`, and `iat`. Using these in your template will cause errors.

2. **Use custom claims instead**: Use custom claims like `user_id` and `user_email` to store user information.

3. **Match RLS policies**: Make sure your Supabase RLS policies use `auth.jwt() ->> 'user_id'` to get the Clerk user ID, not `auth.jwt() ->> 'sub'`.

## Testing the JWT Template

To test if your JWT template is working:

1. In your application code, get a token with:
   ```typescript
   const token = await getToken({ template: 'supabase' });
   console.log('JWT Token:', token);
   ```

2. You can decode this token at https://jwt.io/ to verify it contains the correct claims.

3. Set the token in Supabase with:
   ```typescript
   supabase.auth.setSession({ access_token: token, refresh_token: '' });
   ```

4. Try accessing data protected by RLS policies to verify the integration works.
