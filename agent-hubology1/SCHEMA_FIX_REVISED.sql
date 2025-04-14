-- =============================================
-- SCHEMA FIX SCRIPT (REVISED)
-- =============================================
-- This script fixes schema issues with the transaction pipeline tables
-- to ensure compatibility with the application code.

-- =============================================
-- DROP EXISTING RLS POLICIES
-- =============================================

-- Drop property_transactions policies
DROP POLICY IF EXISTS "Agents can view their own transactions" ON property_transactions;
DROP POLICY IF EXISTS "Agents can insert their own transactions" ON property_transactions;
DROP POLICY IF EXISTS "Agents can update their own transactions" ON property_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON property_transactions;
DROP POLICY IF EXISTS "Admins can manage all transactions" ON property_transactions;

-- Drop commissions policies
DROP POLICY IF EXISTS "Users can view their own commissions" ON commissions;
DROP POLICY IF EXISTS "Users can insert their own commissions" ON commissions;
DROP POLICY IF EXISTS "Admins can manage all commissions" ON commissions;

-- Drop commission_installments policies
DROP POLICY IF EXISTS "Users can view their own installments" ON commission_installments;
DROP POLICY IF EXISTS "Admins can manage all installments" ON commission_installments;

-- =============================================
-- FIX PROPERTY_TRANSACTIONS TABLE
-- =============================================

-- Check if co_agent_commission_percentage column exists, add if not
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'property_transactions' AND column_name = 'co_agent_commission_percentage'
  ) THEN
    ALTER TABLE property_transactions 
    ADD COLUMN co_agent_commission_percentage DECIMAL(5, 2);
  END IF;
END $$;

-- Ensure agent_id is TEXT type for direct comparison with auth.uid()
DO $$
BEGIN
  -- First check the current type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'property_transactions' AND column_name = 'agent_id' AND data_type = 'uuid'
  ) THEN
    -- Create a temporary column
    ALTER TABLE property_transactions ADD COLUMN agent_id_text TEXT;
    
    -- Copy data with conversion
    UPDATE property_transactions SET agent_id_text = agent_id::TEXT;
    
    -- Drop the old column
    ALTER TABLE property_transactions DROP COLUMN agent_id;
    
    -- Rename the new column
    ALTER TABLE property_transactions RENAME COLUMN agent_id_text TO agent_id;
  END IF;
END $$;

-- Ensure co_agent_id is TEXT type for direct comparison with auth.uid()
DO $$
BEGIN
  -- First check the current type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'property_transactions' AND column_name = 'co_agent_id' AND data_type = 'uuid'
  ) THEN
    -- Create a temporary column
    ALTER TABLE property_transactions ADD COLUMN co_agent_id_text TEXT;
    
    -- Copy data with conversion
    UPDATE property_transactions SET co_agent_id_text = co_agent_id::TEXT;
    
    -- Drop the old column
    ALTER TABLE property_transactions DROP COLUMN co_agent_id;
    
    -- Rename the new column
    ALTER TABLE property_transactions RENAME COLUMN co_agent_id_text TO co_agent_id;
  END IF;
END $$;

-- =============================================
-- FIX COMMISSIONS TABLE
-- =============================================

-- Ensure agent_id is TEXT type for direct comparison with auth.uid()
DO $$
BEGIN
  -- First check the current type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'commissions' AND column_name = 'agent_id' AND data_type = 'uuid'
  ) THEN
    -- Create a temporary column
    ALTER TABLE commissions ADD COLUMN agent_id_text TEXT;
    
    -- Copy data with conversion
    UPDATE commissions SET agent_id_text = agent_id::TEXT;
    
    -- Drop the old column
    ALTER TABLE commissions DROP COLUMN agent_id;
    
    -- Rename the new column
    ALTER TABLE commissions RENAME COLUMN agent_id_text TO agent_id;
  END IF;
END $$;

-- =============================================
-- FIX COMMISSION_INSTALLMENTS TABLE
-- =============================================

-- Ensure agent_id is TEXT type for direct comparison with auth.uid()
DO $$
BEGIN
  -- First check the current type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'commission_installments' AND column_name = 'agent_id' AND data_type = 'uuid'
  ) THEN
    -- Create a temporary column
    ALTER TABLE commission_installments ADD COLUMN agent_id_text TEXT;
    
    -- Copy data with conversion
    UPDATE commission_installments SET agent_id_text = agent_id::TEXT;
    
    -- Drop the old column
    ALTER TABLE commission_installments DROP COLUMN agent_id;
    
    -- Rename the new column
    ALTER TABLE commission_installments RENAME COLUMN agent_id_text TO agent_id;
  END IF;
END $$;

-- =============================================
-- CREATE OR REPLACE IS_ADMIN FUNCTION
-- =============================================

-- Create a simple is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For now, just return true for service_role
  RETURN auth.role() = 'service_role';
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =============================================
-- RECREATE RLS POLICIES
-- =============================================

-- Create new policies for property_transactions
CREATE POLICY "Agents can view their own transactions" 
  ON property_transactions FOR SELECT 
  USING (agent_id = auth.uid() OR clerk_id = auth.uid());

CREATE POLICY "Agents can insert their own transactions" 
  ON property_transactions FOR INSERT 
  WITH CHECK (agent_id = auth.uid() OR clerk_id = auth.uid());

CREATE POLICY "Agents can update their own transactions" 
  ON property_transactions FOR UPDATE 
  USING (agent_id = auth.uid() OR clerk_id = auth.uid());

CREATE POLICY "Admins can view all transactions" 
  ON property_transactions FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can manage all transactions" 
  ON property_transactions FOR ALL 
  USING (is_admin());

-- Create new policies for commissions
CREATE POLICY "Users can view their own commissions" 
  ON commissions FOR SELECT 
  USING (agent_id = auth.uid() OR clerk_id = auth.uid());

CREATE POLICY "Users can insert their own commissions" 
  ON commissions FOR INSERT 
  WITH CHECK (agent_id = auth.uid() OR clerk_id = auth.uid());

CREATE POLICY "Admins can manage all commissions" 
  ON commissions FOR ALL 
  USING (is_admin());

-- Create new policies for commission_installments
CREATE POLICY "Users can view their own installments" 
  ON commission_installments FOR SELECT 
  USING (agent_id = auth.uid());

CREATE POLICY "Admins can manage all installments" 
  ON commission_installments FOR ALL 
  USING (is_admin());

-- =============================================
-- CREATE TEST TRANSACTION FOR CURRENT USER
-- =============================================

-- This function creates a test transaction for the specified user
CREATE OR REPLACE FUNCTION create_test_transaction(user_id TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  transaction_id UUID;
  payment_schedule_id UUID;
BEGIN
  -- Get default payment schedule
  SELECT id INTO payment_schedule_id FROM commission_payment_schedules WHERE is_default = true LIMIT 1;
  
  -- Insert test transaction
  INSERT INTO property_transactions (
    transaction_date,
    transaction_value,
    commission_rate,
    commission_amount,
    agent_id,
    clerk_id,
    status,
    notes,
    buyer_name,
    buyer_email,
    buyer_phone,
    seller_name,
    seller_email,
    seller_phone,
    payment_schedule_id,
    co_agent_commission_percentage
  ) VALUES (
    CURRENT_DATE,
    100000.00,
    5.00,
    5000.00,
    user_id,
    user_id,
    'Pending',
    'Test transaction created via SQL',
    'Test Buyer',
    'buyer@test.com',
    '123-456-7890',
    'Test Seller',
    'seller@test.com',
    '123-456-7890',
    payment_schedule_id,
    0.00
  ) RETURNING id INTO transaction_id;
  
  RETURN transaction_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION create_test_transaction(TEXT) TO authenticated;

-- =============================================
-- FINAL MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Schema fix complete!';
END $$;
