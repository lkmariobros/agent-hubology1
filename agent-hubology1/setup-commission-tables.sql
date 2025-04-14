-- Setup script for commission-related tables in Supabase lkmariobros project
-- Run this in the SQL Editor of your Supabase project

-- Create property_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.property_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  property_id UUID NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Sale', 'Rental', 'Lease')),
  transaction_status TEXT NOT NULL DEFAULT 'Pending' CHECK (transaction_status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
  commission_amount DECIMAL(12, 2) NOT NULL,
  payment_schedule_id UUID,
  installments_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_payment_schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commission_payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create schedule_installments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.schedule_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.commission_payment_schedules(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  days_after_transaction INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (schedule_id, installment_number)
);

-- Create commission_installments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commission_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.property_transactions(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  agent_id UUID NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Paid', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (transaction_id, installment_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_transactions_agent_id ON public.property_transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_commission_installments_agent_id ON public.commission_installments(agent_id);
CREATE INDEX IF NOT EXISTS idx_commission_installments_transaction_id ON public.commission_installments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_schedule_installments_schedule_id ON public.schedule_installments(schedule_id);

-- Enable Row Level Security
ALTER TABLE public.property_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_installments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- For property_transactions
CREATE POLICY "Agents can view their own transactions"
  ON public.property_transactions
  FOR SELECT
  USING (agent_id = auth.uid() OR agent_id = (auth.jwt() ->> 'user_id')::UUID);

CREATE POLICY "Admins can view all transactions"
  ON public.property_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE (id = auth.uid() OR clerk_id = auth.jwt() ->> 'user_id') AND role = 'admin'
    )
  );

-- For commission_payment_schedules
CREATE POLICY "All authenticated users can view payment schedules"
  ON public.commission_payment_schedules
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage payment schedules"
  ON public.commission_payment_schedules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE (id = auth.uid() OR clerk_id = auth.jwt() ->> 'user_id') AND role = 'admin'
    )
  );

-- For schedule_installments
CREATE POLICY "All authenticated users can view schedule installments"
  ON public.schedule_installments
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage schedule installments"
  ON public.schedule_installments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE (id = auth.uid() OR clerk_id = auth.jwt() ->> 'user_id') AND role = 'admin'
    )
  );

-- For commission_installments
CREATE POLICY "Agents can view their own installments"
  ON public.commission_installments
  FOR SELECT
  USING (agent_id = auth.uid() OR agent_id = (auth.jwt() ->> 'user_id')::UUID);

CREATE POLICY "Admins can view all installments"
  ON public.commission_installments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE (id = auth.uid() OR clerk_id = auth.jwt() ->> 'user_id') AND role = 'admin'
    )
  );

-- Insert default payment schedule
INSERT INTO public.commission_payment_schedules (name, description, is_default)
VALUES ('Standard Schedule', 'Default payment schedule with 3 installments', TRUE)
ON CONFLICT DO NOTHING;

-- Get the ID of the default schedule
DO $$
DECLARE
  default_schedule_id UUID;
BEGIN
  SELECT id INTO default_schedule_id FROM public.commission_payment_schedules WHERE is_default = TRUE LIMIT 1;
  
  -- Insert default installments
  INSERT INTO public.schedule_installments (schedule_id, installment_number, percentage, days_after_transaction, description)
  VALUES 
    (default_schedule_id, 1, 40, 0, 'Initial payment upon transaction completion'),
    (default_schedule_id, 2, 30, 30, 'Second payment after 30 days'),
    (default_schedule_id, 3, 30, 60, 'Final payment after 60 days')
  ON CONFLICT DO NOTHING;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.property_transactions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.commission_payment_schedules TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.schedule_installments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.commission_installments TO anon, authenticated;
