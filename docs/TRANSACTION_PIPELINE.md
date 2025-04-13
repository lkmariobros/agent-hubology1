# Transaction Pipeline Documentation

This document outlines the transaction pipeline from agent portal to admin portal, including database schema, authentication, and data flow.

## Overview

The transaction pipeline allows agents to submit transaction information through a multi-step form. This information is stored in Supabase and made available to administrators for review and approval. The pipeline includes commission calculations, payment schedules, and document management.

## Database Schema

### Key Tables

1. **property_transactions**
   - Primary table for storing transaction details
   - Uses UUID for `agent_id` with proper type casting for auth.uid() compatibility
   - Contains transaction value, commission rate, and other core transaction data

2. **commissions**
   - Stores commission information related to transactions
   - Links to payment schedules for installment generation

3. **commission_payment_schedules**
   - Defines templates for commission payment schedules
   - Contains default schedules for different transaction types

4. **schedule_installments**
   - Defines the installments for each payment schedule
   - Specifies percentage and timing for each payment

5. **commission_installments**
   - Stores the actual installment records for each transaction
   - Generated based on the selected payment schedule

6. **transaction_documents**
   - Stores documents uploaded for each transaction
   - Links documents to transactions and tracks who uploaded them

7. **commission_approvals**
   - Tracks the approval workflow for commissions
   - Records reviewer actions and notes

## UUID Implementation

We use UUID for `agent_id` in the database for several reasons:

1. **Type Consistency**: Maintains consistency with other ID fields in the database
2. **Performance**: Better indexing performance with fixed-length UUIDs
3. **Referential Integrity**: Easier to maintain foreign key relationships

To handle the comparison between UUID `agent_id` and TEXT `auth.uid()`, we use proper type casting in RLS policies:

```sql
USING (agent_id::text = auth.uid() OR clerk_id = auth.uid())
```

We also provide helper functions to simplify this conversion:

```sql
CREATE OR REPLACE FUNCTION public.text_to_uuid(text_id TEXT)
RETURNS UUID
LANGUAGE plpgsql
AS $$
BEGIN
  BEGIN
    RETURN text_id::UUID;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN NULL;
  END;
END;
$$;
```

## Authentication Flow

1. **Clerk Authentication**:
   - User authenticates with Clerk
   - Clerk provides a JWT token with the user's ID

2. **Supabase Integration**:
   - JWT token is passed to Supabase
   - Supabase verifies the token and extracts the user ID
   - RLS policies use `auth.uid()` to restrict access to data

3. **Admin Access**:
   - Admin status is determined by the `is_admin_tier()` function
   - Admins have broader access to data through RLS policies

## Data Flow

### Agent Portal

1. **Transaction Form**:
   - Agent fills out multi-step form
   - Form collects property, client, and transaction details
   - Commission is calculated based on transaction value and rate

2. **Submission**:
   - Data is submitted to Supabase
   - `agent_id` is set to the authenticated user's ID
   - Commission installments are generated based on the selected payment schedule

3. **Document Upload**:
   - Agent can upload supporting documents
   - Documents are stored in Supabase Storage
   - Document metadata is recorded in the `transaction_documents` table

### Admin Portal

1. **Transaction List**:
   - Admins see all transactions
   - Agents only see their own transactions
   - Real-time updates using Supabase Realtime

2. **Commission Approval**:
   - Admins review and approve commissions
   - Approval status is tracked in the `commission_approvals` table
   - Notifications are sent to agents when approvals change

3. **Payment Management**:
   - Admins can track and manage commission payments
   - Payment status is updated in the `commission_installments` table

## Edge Functions

Edge functions are used to handle complex operations:

1. **generate_commission_installments**:
   - Generates installment records based on the selected payment schedule
   - Calculates payment amounts and dates
   - Updates the transaction to mark installments as generated

2. **Future Edge Functions**:
   - Notification delivery
   - Payment processing
   - Document verification

## Row Level Security (RLS)

RLS policies ensure that users can only access their own data:

1. **Agent Policies**:
   - Agents can view and edit their own transactions
   - Agents can view their own commissions and installments

2. **Admin Policies**:
   - Admins can view and manage all transactions
   - Admins can approve commissions and manage payment schedules

## Realtime Updates

Supabase Realtime is enabled for all transaction-related tables, allowing:

1. **Live Dashboard Updates**:
   - Admins see new transactions in real-time
   - Commission approval status updates instantly

2. **Agent Notifications**:
   - Agents receive updates on approval status
   - Payment notifications appear in real-time

## Implementation Notes

1. **Type Casting**:
   - UUID fields are cast to text when comparing with `auth.uid()`
   - Helper functions simplify this conversion in complex queries

2. **Error Handling**:
   - Fallback to demo mode when database issues occur
   - Detailed error messages for debugging

3. **Performance Considerations**:
   - Indexes on frequently queried fields
   - Efficient RLS policies to minimize query overhead

## Future Enhancements

1. **Batch Processing**:
   - Handle multiple transactions in a single operation
   - Bulk approval workflows

2. **Advanced Reporting**:
   - Commission forecasting
   - Performance analytics

3. **Integration with External Systems**:
   - Accounting software integration
   - Payment processor integration
