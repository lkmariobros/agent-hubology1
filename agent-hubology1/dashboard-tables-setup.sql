-- Dashboard Tables Setup Script for Agent Hubology
-- Run this in the SQL Editor of your Supabase project after running supabase-clerk-setup-fixed.sql

-- Create property_types table
CREATE TABLE IF NOT EXISTS public.property_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default property types
INSERT INTO public.property_types (name) VALUES
  ('Residential'),
  ('Commercial'),
  ('Industrial'),
  ('Land')
ON CONFLICT (name) DO NOTHING;

-- Create enhanced_properties table
CREATE TABLE IF NOT EXISTS public.enhanced_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  address JSONB NOT NULL,
  type TEXT NOT NULL,
  subtype TEXT,
  features TEXT[],
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(10, 2),
  images TEXT[],
  status TEXT DEFAULT 'available',
  agent_id UUID,
  clerk_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.enhanced_properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create property_transactions table
CREATE TABLE IF NOT EXISTS public.property_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.enhanced_properties(id),
  agent_id UUID,
  clerk_id TEXT,
  co_agent_id UUID,
  co_agent_clerk_id TEXT,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  seller_name TEXT,
  seller_email TEXT,
  seller_phone TEXT,
  transaction_date DATE NOT NULL,
  closing_date DATE,
  transaction_value DECIMAL(12, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  budget TEXT,
  location TEXT,
  status TEXT DEFAULT 'New',
  posted_by TEXT,
  posted_by_clerk_id TEXT,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for property_types - everyone can view
CREATE POLICY "Anyone can view property types" 
ON public.property_types FOR SELECT USING (true);

-- Create policies for enhanced_properties - everyone can view
CREATE POLICY "Anyone can view properties" 
ON public.enhanced_properties FOR SELECT USING (true);

-- Create policy that allows only property owners or admins to update properties
CREATE POLICY "Owners or admins can update properties" 
ON public.enhanced_properties 
FOR UPDATE 
USING (
  clerk_id = auth.jwt() ->> 'user_id' OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin')
);

-- Create policy for property_images - everyone can view
CREATE POLICY "Anyone can view property images" 
ON public.property_images FOR SELECT USING (true);

-- Create policy for property_transactions - authenticated users can view
CREATE POLICY "Authenticated users can view transactions" 
ON public.property_transactions 
FOR SELECT 
USING (auth.jwt() ->> 'user_id' IS NOT NULL);

-- Create policy for property_transactions - own transactions
CREATE POLICY "Agents can update own transactions" 
ON public.property_transactions 
FOR UPDATE 
USING (
  clerk_id = auth.jwt() ->> 'user_id' OR 
  co_agent_clerk_id = auth.jwt() ->> 'user_id' OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin')
);

-- Create policy for opportunities - everyone can view
CREATE POLICY "Anyone can view opportunities" 
ON public.opportunities FOR SELECT USING (true);

-- Create policy for opportunities - own opportunities
CREATE POLICY "Users can update own opportunities" 
ON public.opportunities 
FOR UPDATE 
USING (
  posted_by_clerk_id = auth.jwt() ->> 'user_id' OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin')
);

-- Create policy for opportunities - authenticated users can insert
CREATE POLICY "Authenticated users can insert opportunities" 
ON public.opportunities 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'user_id' IS NOT NULL);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.property_types TO anon, authenticated;
GRANT SELECT ON public.enhanced_properties TO anon, authenticated;
GRANT SELECT ON public.property_images TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.property_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.opportunities TO authenticated;

-- Insert sample data for testing
-- Sample properties
INSERT INTO public.enhanced_properties (title, description, price, address, type, subtype, features, bedrooms, bathrooms, area, status, clerk_id)
VALUES 
  (
    'Modern Downtown Apartment', 
    'Luxurious apartment in downtown with excellent amenities.', 
    425000, 
    '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "zip": "94102", "country": "USA"}', 
    'Residential', 
    'Apartment', 
    ARRAY['balcony', 'parking', 'pool'], 
    2, 
    2, 
    1200, 
    'available',
    NULL
  ),
  (
    'Suburban Family Home', 
    'Spacious family home with large backyard in quiet neighborhood.', 
    750000, 
    '{"street": "456 Oak Ave", "city": "Palo Alto", "state": "CA", "zip": "94301", "country": "USA"}', 
    'Residential', 
    'House', 
    ARRAY['backyard', 'garage', 'renovated kitchen'], 
    4, 
    3, 
    2500, 
    'pending',
    NULL
  ),
  (
    'Commercial Office Space', 
    'Prime location commercial office in the business district.', 
    1200000, 
    '{"street": "789 Market St", "city": "San Francisco", "state": "CA", "zip": "94103", "country": "USA"}', 
    'Commercial', 
    'Office', 
    ARRAY['reception', 'conference rooms', 'parking'], 
    NULL, 
    NULL, 
    3500, 
    'available',
    NULL
  );

-- Sample opportunities
INSERT INTO public.opportunities (title, description, property_type, budget, location, status, posted_by)
VALUES 
  (
    'Family looking for 3BR apartment', 
    'Family of 4 needs 3-bedroom apartment in central area with good schools nearby.', 
    'Residential', 
    'RM450,000 - RM550,000', 
    'Kuala Lumpur (KLCC, Bangsar)', 
    'Urgent', 
    'Sarah Johnson'
  ),
  (
    'Retail space for boutique', 
    'Fashion designer looking for 800-1000 sq ft retail space in a high foot traffic area.', 
    'Commercial', 
    'RM8,000 - RM12,000/mo', 
    'Bukit Bintang, Pavilion area', 
    'New', 
    'Michael Brown'
  ),
  (
    'Land for agricultural project', 
    'Investor seeking 2-5 acres of agricultural land for sustainable farming project.', 
    'Land', 
    'RM1.2M - RM2.5M', 
    'Selangor (Rawang, Semenyih)', 
    'Featured', 
    'John Smith'
  );
