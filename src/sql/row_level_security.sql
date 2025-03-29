
-- Enable Row Level Security on enhanced_properties
ALTER TABLE public.enhanced_properties ENABLE ROW LEVEL SECURITY;

-- Create policy for properties - everyone can view
CREATE POLICY "Anyone can view properties" 
ON public.enhanced_properties FOR SELECT USING (true);

-- Create policy that allows only property owners or admins to update properties
CREATE POLICY "Owners or admins can update properties" 
ON public.enhanced_properties 
FOR UPDATE 
USING (
  auth.uid() = agent_id OR 
  EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 5)
);

-- Create policy that allows only property owners or admins to delete properties
CREATE POLICY "Owners or admins can delete properties" 
ON public.enhanced_properties 
FOR DELETE 
USING (
  auth.uid() = agent_id OR 
  EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 5)
);

-- Create policy that allows authenticated users to insert properties
CREATE POLICY "Authenticated users can insert properties" 
ON public.enhanced_properties 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable Row Level Security on property_images
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Create policy for property_images - anyone can view
CREATE POLICY "Anyone can view property images" 
ON public.property_images FOR SELECT USING (true);

-- Create policy for property_images - only owners or admins can update/delete
CREATE POLICY "Owners or admins can update property images" 
ON public.property_images 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM enhanced_properties 
    WHERE id = property_images.property_id AND 
    (agent_id = auth.uid() OR EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 5))
  )
);

CREATE POLICY "Owners or admins can delete property images" 
ON public.property_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM enhanced_properties 
    WHERE id = property_images.property_id AND 
    (agent_id = auth.uid() OR EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 5))
  )
);

-- Create policy for property_images - authenticated users can insert
CREATE POLICY "Authenticated users can insert property images" 
ON public.property_images 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable Row Level Security on property_transactions
ALTER TABLE public.property_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for property_transactions - authenticated users can view
CREATE POLICY "Authenticated users can view transactions" 
ON public.property_transactions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create policy for property_transactions - own transactions
CREATE POLICY "Agents can update own transactions" 
ON public.property_transactions 
FOR UPDATE 
USING (agent_id = auth.uid() OR co_agent_id = auth.uid() OR EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 5));

CREATE POLICY "Agents can delete own transactions" 
ON public.property_transactions 
FOR DELETE 
USING (agent_id = auth.uid() OR EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 5));

-- Create policy for property_transactions - authenticated users can insert
CREATE POLICY "Authenticated users can insert transactions" 
ON public.property_transactions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable Row Level Security on agent_profiles
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for agent_profiles - public view
CREATE POLICY "Anyone can view agent_profiles" 
ON public.agent_profiles 
FOR SELECT 
USING (true);

-- Create policy for agent_profiles - own profile
CREATE POLICY "Agents can update own profile" 
ON public.agent_profiles 
FOR UPDATE 
USING (id = auth.uid() OR EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 5));

-- Enable Row Level Security on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for notifications - own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications" 
ON public.notifications 
FOR DELETE 
USING (user_id = auth.uid());

-- Enable Row Level Security on commission_approvals
ALTER TABLE public.commission_approvals ENABLE ROW LEVEL SECURITY;

-- Create policy for commission_approvals - authenticated users can view
CREATE POLICY "Authenticated users can view approvals" 
ON public.commission_approvals 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create policy for commission_approvals - reviewers or admins can update
CREATE POLICY "Reviewers or admins can update approvals" 
ON public.commission_approvals 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM agent_profiles WHERE id = auth.uid() AND tier >= 4) OR
  submitted_by = auth.uid()
);

-- Create policy for commission_approvals - authenticated users can insert
CREATE POLICY "Authenticated users can insert approvals" 
ON public.commission_approvals 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
