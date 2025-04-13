-- Role Hierarchy System Setup

-- Create role_hierarchy table to define parent-child relationships between roles
CREATE TABLE IF NOT EXISTS public.role_hierarchy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    child_role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_role_relationship UNIQUE (parent_role_id, child_role_id),
    -- Prevent circular references
    CONSTRAINT no_self_reference CHECK (parent_role_id != child_role_id)
);

-- Create role_levels table to define agent progression levels
CREATE TABLE IF NOT EXISTS public.role_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    min_sales_value INTEGER DEFAULT 0,
    next_level_threshold INTEGER,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default agent role levels
INSERT INTO public.role_levels (name, display_name, description, min_sales_value, next_level_threshold, order_index)
VALUES
    ('junior_agent', 'Junior Agent', 'New agents with sales under $5M', 0, 5000000, 1),
    ('agent', 'Agent', 'Regular agents with sales between $5M and $15M', 5000000, 15000000, 2),
    ('senior_agent', 'Senior Agent', 'Experienced agents with sales between $15M and $45M', 15000000, 45000000, 3),
    ('associate_director', 'Associate Director', 'High performing agents with sales between $45M and $100M', 45000000, 100000000, 4),
    ('director', 'Director', 'Top performing agents with sales over $100M', 100000000, NULL, 5)
ON CONFLICT (name) DO NOTHING;

-- Function to get all ancestor roles (parent, grandparent, etc.) for a given role
CREATE OR REPLACE FUNCTION public.get_role_ancestors(role_id UUID)
RETURNS TABLE (ancestor_id UUID, depth INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY WITH RECURSIVE role_tree AS (
        -- Base case: start with the immediate parents
        SELECT parent_role_id AS ancestor_id, 1 AS depth
        FROM public.role_hierarchy
        WHERE child_role_id = role_id
        
        UNION ALL
        
        -- Recursive case: add each ancestor's parents
        SELECT rh.parent_role_id, rt.depth + 1
        FROM role_tree rt
        JOIN public.role_hierarchy rh ON rh.child_role_id = rt.ancestor_id
    )
    SELECT DISTINCT * FROM role_tree;
END;
$$;

-- Function to get all descendant roles (child, grandchild, etc.) for a given role
CREATE OR REPLACE FUNCTION public.get_role_descendants(role_id UUID)
RETURNS TABLE (descendant_id UUID, depth INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY WITH RECURSIVE role_tree AS (
        -- Base case: start with the immediate children
        SELECT child_role_id AS descendant_id, 1 AS depth
        FROM public.role_hierarchy
        WHERE parent_role_id = role_id
        
        UNION ALL
        
        -- Recursive case: add each descendant's children
        SELECT rh.child_role_id, rt.depth + 1
        FROM role_tree rt
        JOIN public.role_hierarchy rh ON rh.parent_role_id = rt.descendant_id
    )
    SELECT DISTINCT * FROM role_tree;
END;
$$;

-- Function to check if a user has a specific role or any of its parent roles
CREATE OR REPLACE FUNCTION public.user_has_role_or_parent(user_id TEXT, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_role_id UUID;
    v_has_role BOOLEAN := FALSE;
BEGIN
    -- Get the requested role ID
    SELECT id INTO v_role_id FROM public.roles WHERE name = role_name;
    
    IF v_role_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has the role directly
    SELECT EXISTS (
        SELECT 1 
        FROM public.profiles p
        WHERE p.clerk_id = user_id AND p.role = role_name
    ) INTO v_has_role;
    
    IF v_has_role THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user has any parent role (which would include this role's permissions)
    SELECT EXISTS (
        SELECT 1 
        FROM public.profiles p
        JOIN public.roles r ON p.role = r.name
        JOIN public.get_role_ancestors(v_role_id) a ON a.ancestor_id = r.id
        WHERE p.clerk_id = user_id
    ) INTO v_has_role;
    
    RETURN v_has_role;
END;
$$;

-- Function to get all permissions for a role, including inherited permissions from parent roles
CREATE OR REPLACE FUNCTION public.get_role_permissions_with_inheritance(role_id UUID)
RETURNS TABLE (permission_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY 
    -- Get direct permissions
    SELECT rp.permission_id
    FROM public.role_permissions rp
    WHERE rp.role_id = role_id
    
    UNION
    
    -- Get inherited permissions from parent roles
    SELECT rp.permission_id
    FROM public.get_role_ancestors(role_id) a
    JOIN public.role_permissions rp ON rp.role_id = a.ancestor_id;
END;
$$;

-- Modify the agent_details table to link with role_levels
ALTER TABLE public.agent_details 
ADD COLUMN IF NOT EXISTS role_level_id UUID REFERENCES public.role_levels(id);

-- Create RLS policies for role_hierarchy
ALTER TABLE public.role_hierarchy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view role hierarchy"
    ON public.role_hierarchy FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can modify role hierarchy"
    ON public.role_hierarchy FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for role_levels
ALTER TABLE public.role_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view role levels"
    ON public.role_levels FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify role levels"
    ON public.role_levels FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE clerk_id = auth.uid() AND role = 'admin'
        )
    );