# Edge Functions for Deployment

This directory contains all the edge functions that need to be deployed to your Supabase project. Each file corresponds to a single edge function.

## How to Deploy

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select your project: `lkmariobros's Project`
3. Navigate to "Edge Functions" in the left sidebar
4. Click "Create a new function"
5. Enter the function name (same as the file name without the `.ts` extension)
6. Set "Verify JWT" to true
7. Copy and paste the code from the corresponding file
8. Click "Create"

## Function Descriptions

1. **add_commission_approval_comment.ts**
   - Adds a comment to a commission approval
   - Used by admins and agents to communicate about commission approvals

2. **create_notification.ts**
   - Creates a notification for a user
   - Used for system notifications and alerts

3. **delete_commission_approval_comment.ts**
   - Deletes a comment from a commission approval
   - Used by admins and agents to manage comments

4. **delete_notification.ts**
   - Deletes a notification
   - Used by users to clear notifications

5. **generate_commission_forecast.ts**
   - Generates a forecast of future commission payments
   - Used by agents to plan their finances

6. **generate_commission_installments.ts**
   - Generates installment payments for a commission
   - Used when a new transaction is created

7. **generate_installments_on_approval.ts**
   - Generates installment payments when a commission is approved
   - Used by admins when approving commissions

8. **get_agent_profile.ts**
   - Gets the profile of the current agent
   - Used for displaying agent information

9. **get_approval_status_counts.ts**
   - Gets counts of approvals by status
   - Used for dashboard statistics

10. **get_approved_commission_total.ts**
    - Gets the total amount of approved commissions
    - Used for dashboard statistics

11. **get_commission_approvals.ts**
    - Gets a list of commission approvals
    - Used by admins to review approvals

12. **get_commission_approval_comments.ts**
    - Gets comments for a commission approval
    - Used in the approval detail view

13. **get_commission_approval_detail.ts**
    - Gets detailed information about a commission approval
    - Used in the approval detail view

14. **get_commission_approval_history.ts**
    - Gets the history of a commission approval
    - Used to track changes to an approval

15. **get_pending_commission_total.ts**
    - Gets the total amount of pending commissions
    - Used for dashboard statistics

16. **get_user_notifications.ts**
    - Gets notifications for the current user
    - Used in the notifications panel

17. **mark_all_notifications_read.ts**
    - Marks all notifications as read
    - Used in the notifications panel

18. **mark_notification_read.ts**
    - Marks a single notification as read
    - Used in the notifications panel

19. **send-agent-invitation.ts**
    - Sends an invitation to a new agent
    - Used by admins to invite new agents

20. **update_commission_approval_status.ts**
    - Updates the status of a commission approval
    - Used by admins to approve or reject commissions

## After Deployment

After deploying all edge functions, test your application to ensure everything is working correctly. If you encounter any issues, check the function logs in the Supabase dashboard for more information.
