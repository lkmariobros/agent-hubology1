# Manual Edge Functions Deployment Guide

Since we're encountering authentication issues with the API, this guide will help you manually deploy all the edge functions through the Supabase dashboard.

## Step 1: Access Your Supabase Dashboard

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Log in to your account
3. Select your project: `lkmariobros's Project`

## Step 2: Navigate to Edge Functions

1. In the left sidebar, click on "Edge Functions"
2. You should see a list of your existing edge functions (if any)

## Step 3: Deploy Each Edge Function

For each function in your codebase, follow these steps:

1. Click the "Create a new function" button
2. Enter the function name (same as the directory name in your codebase)
3. Set "Verify JWT" to true for authenticated functions
4. Copy and paste the code from your local `index.ts` file
5. Click "Create"

## List of Edge Functions to Deploy

Here's a list of all the edge functions in your codebase that need to be deployed:

1. **add_commission_approval_comment**
   - Location: `supabase/functions/add_commission_approval_comment/index.ts`
   - Verify JWT: true

2. **create_notification**
   - Location: `supabase/functions/create_notification/index.ts`
   - Verify JWT: true

3. **delete_commission_approval_comment**
   - Location: `supabase/functions/delete_commission_approval_comment/index.ts`
   - Verify JWT: true

4. **delete_notification**
   - Location: `supabase/functions/delete_notification/index.ts`
   - Verify JWT: true

5. **generate_commission_forecast**
   - Location: `supabase/functions/generate_commission_forecast/index.ts`
   - Verify JWT: true

6. **generate_commission_installments**
   - Location: `supabase/functions/generate_commission_installments/index.ts`
   - Verify JWT: true

7. **generate_installments_on_approval**
   - Location: `supabase/functions/generate_installments_on_approval/index.ts`
   - Verify JWT: true

8. **get_agent_profile**
   - Location: `supabase/functions/get_agent_profile/index.ts`
   - Verify JWT: true

9. **get_approval_status_counts**
   - Location: `supabase/functions/get_approval_status_counts/index.ts`
   - Verify JWT: true

10. **get_approved_commission_total**
    - Location: `supabase/functions/get_approved_commission_total/index.ts`
    - Verify JWT: true

11. **get_commission_approvals**
    - Location: `supabase/functions/get_commission_approvals/index.ts`
    - Verify JWT: true

12. **get_commission_approval_comments**
    - Location: `supabase/functions/get_commission_approval_comments/index.ts`
    - Verify JWT: true

13. **get_commission_approval_detail**
    - Location: `supabase/functions/get_commission_approval_detail/index.ts`
    - Verify JWT: true

14. **get_commission_approval_history**
    - Location: `supabase/functions/get_commission_approval_history/index.ts`
    - Verify JWT: true

15. **get_pending_commission_total**
    - Location: `supabase/functions/get_pending_commission_total/index.ts`
    - Verify JWT: true

16. **get_user_notifications**
    - Location: `supabase/functions/get_user_notifications/index.ts`
    - Verify JWT: true

17. **mark_all_notifications_read**
    - Location: `supabase/functions/mark_all_notifications_read/index.ts`
    - Verify JWT: true

18. **mark_notification_read**
    - Location: `supabase/functions/mark_notification_read/index.ts`
    - Verify JWT: true

19. **send-agent-invitation**
    - Location: `supabase/functions/send-agent-invitation/index.ts`
    - Verify JWT: true

20. **update_commission_approval_status**
    - Location: `supabase/functions/update_commission_approval_status/index.ts`
    - Verify JWT: true

## Step 4: Verify Deployment

After deploying each function:

1. Click on the function name in the list
2. Click the "Logs" tab
3. Check for any errors
4. Test the function by making a request to it from your application

## Troubleshooting

If you encounter any issues:

1. Check the function logs for error messages
2. Ensure all dependencies are correctly imported
3. Verify that the CORS headers are properly set
4. Make sure the function has the correct permissions (JWT verification)

## Next Steps

After deploying all edge functions, test your application to ensure everything is working correctly. If you encounter any issues, check the function logs in the Supabase dashboard for more information.
