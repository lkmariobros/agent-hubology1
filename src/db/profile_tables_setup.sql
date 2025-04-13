-- Profile Tables Setup for Clerk Integration

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'agent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent_details table for agent-specific data
CREATE TABLE IF NOT EXISTS public.agent_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    level TEXT NOT NULL DEFAULT 'junior',
    sales_target INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    next_level_target INTEGER DEFAULT 5000000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(profile_id)
);

-- Create user_preferences table for user settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    dark_mode BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    preferred_portal TEXT DEFAULT 'agent',
    theme TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(profile_id)
);

-- Create function to get profile by clerk_id
CREATE OR REPLACE FUNCTION public.get_profile_by_clerk_id(p_clerk_id TEXT)
RETURNS SETOF profiles
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM public.profiles
    WHERE clerk_id = p_clerk_id;
$$;

-- Create function to create or update profile for Clerk user
CREATE OR REPLACE FUNCTION public.create_profile_for_clerk_user(
    p_clerk_id TEXT,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_role TEXT DEFAULT 'agent'
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_profile_id UUID;
    v_profile public.profiles;
BEGIN
    -- Check if profile exists
    SELECT id INTO v_profile_id 
    FROM public.profiles
    WHERE clerk_id = p_clerk_id;
    
    IF v_profile_id IS NULL THEN
        -- Insert new profile
        INSERT INTO public.profiles (
            clerk_id,
            email,
            first_name,
            last_name,
            role,
            created_at,
            updated_at
        ) VALUES (
            p_clerk_id,
            p_email,
            p_first_name,
            p_last_name,
            p_role,
            now(),
            now()
        )
        RETURNING * INTO v_profile;
    ELSE
        -- Update existing profile
        UPDATE public.profiles
        SET
            email = p_email,
            first_name = p_first_name,
            last_name = p_last_name,
            role = p_role,
            updated_at = now()
        WHERE id = v_profile_id
        RETURNING * INTO v_profile;
    END IF;
    
    RETURN v_profile;
END;
$$;

-- Create RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (clerk_id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (clerk_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for agent_details table
ALTER TABLE public.agent_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agent details"
    ON public.agent_details FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE clerk_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own agent details"
    ON public.agent_details FOR UPDATE
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE clerk_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all agent details"
    ON public.agent_details FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all agent details"
    ON public.agent_details FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for user_preferences table
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE clerk_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE clerk_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all preferences"
    ON public.user_preferences FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all preferences"
    ON public.user_preferences FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );