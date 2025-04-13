-- Create property_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.property_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL,
  property_id UUID,
  transaction_value DECIMAL(12, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(12, 2) NOT NULL,
  agent_id TEXT,
  clerk_id TEXT,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  seller_name TEXT,
  seller_email TEXT,
  seller_phone TEXT,
  closing_date DATE,
  commission_split BOOLEAN DEFAULT false,
  co_agent_id TEXT,
  co_agent_commission_percentage DECIMAL(5, 2),
  payment_schedule_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transaction_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transaction_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.property_transactions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT,
  storage_path TEXT NOT NULL,
  clerk_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.property_transactions(id) ON DELETE CASCADE,
  agent_id TEXT,
  clerk_id TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  payment_schedule_id UUID REFERENCES public.commission_payment_schedules(id),
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_installments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commission_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID REFERENCES public.commissions(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'Pending',
  payment_date DATE,
  agent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on these tables
ALTER TABLE public.property_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_installments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for property_transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own transactions'
  ) THEN
    CREATE POLICY "Users can view their own transactions" 
    ON public.property_transactions FOR SELECT 
    USING (clerk_id = auth.jwt() ->> 'sub');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own transactions'
  ) THEN
    CREATE POLICY "Users can insert their own transactions" 
    ON public.property_transactions FOR INSERT 
    WITH CHECK (clerk_id = auth.jwt() ->> 'sub');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own transactions'
  ) THEN
    CREATE POLICY "Users can update their own transactions" 
    ON public.property_transactions FOR UPDATE 
    USING (clerk_id = auth.jwt() ->> 'sub');
  END IF;
END $$;

-- Create RLS policies for transaction_documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own documents'
  ) THEN
    CREATE POLICY "Users can view their own documents" 
    ON public.transaction_documents FOR SELECT 
    USING (clerk_id = auth.jwt() ->> 'sub');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own documents'
  ) THEN
    CREATE POLICY "Users can insert their own documents" 
    ON public.transaction_documents FOR INSERT 
    WITH CHECK (clerk_id = auth.jwt() ->> 'sub');
  END IF;
END $$;

-- Create RLS policies for commissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own commissions'
  ) THEN
    CREATE POLICY "Users can view their own commissions" 
    ON public.commissions FOR SELECT 
    USING (clerk_id = auth.jwt() ->> 'sub');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own commissions'
  ) THEN
    CREATE POLICY "Users can insert their own commissions" 
    ON public.commissions FOR INSERT 
    WITH CHECK (clerk_id = auth.jwt() ->> 'sub');
  END IF;
END $$;

-- Create RLS policies for commission_installments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own installments'
  ) THEN
    CREATE POLICY "Users can view their own installments" 
    ON public.commission_installments FOR SELECT 
    USING (agent_id = auth.jwt() ->> 'sub');
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.property_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.transaction_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.commissions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.commission_installments TO authenticated;

-- Create storage bucket for transaction documents if it doesn't exist
-- Note: This requires superuser privileges and may need to be done manually
-- in the Supabase dashboard if you don't have superuser access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'transaction_documents'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('transaction_documents', 'transaction_documents', false);
  END IF;
END $$;

-- Create storage policy for transaction documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies WHERE name = 'Transaction Documents Policy'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Transaction Documents Policy',
      'transaction_documents',
      jsonb_build_object(
        'resource', 'object',
        'action', 'select',
        'condition', jsonb_build_object(
          'prefix', format('%s/', auth.uid())
        )
      )
    );
  END IF;
END $$;
