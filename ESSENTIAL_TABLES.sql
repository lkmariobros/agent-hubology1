-- Create commissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID,
  agent_id TEXT,
  clerk_id TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  payment_schedule_id UUID,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the commissions table
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

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

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.commissions TO authenticated;
