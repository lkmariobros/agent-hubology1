-- Migration: Update Notifications System for Clerk JWT Integration
-- This migration adds clerk_id support to the notifications table and updates RLS policies

-----------------------------------------------------------------------
-- STEP 1: Create a backup of the current notifications table
-----------------------------------------------------------------------

-- Store current notifications data
DROP TABLE IF EXISTS public.temp_notifications_backup;
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE TABLE public.temp_notifications_backup AS
        SELECT * FROM public.notifications;
    ELSE
        CREATE TABLE public.temp_notifications_backup (
            id UUID,
            user_id UUID,
            type TEXT,
            title TEXT,
            message TEXT,
            data JSONB,
            read BOOLEAN,
            created_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-----------------------------------------------------------------------
-- STEP 2: Modify the notifications table to support clerk_id
-----------------------------------------------------------------------

-- If the table exists but doesn't have clerk_id, add it
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') AND 
       NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'clerk_id') THEN
        ALTER TABLE public.notifications ADD COLUMN clerk_id TEXT;
        
        -- Create an index for the new column
        CREATE INDEX IF NOT EXISTS notifications_clerk_id_idx ON public.notifications (clerk_id);
    END IF;
END $$;

-- If the table doesn't exist, create it with all required columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE TABLE public.notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
            clerk_id TEXT,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            data JSONB,
            read BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Create indices
        CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications (user_id);
        CREATE INDEX IF NOT EXISTS notifications_clerk_id_idx ON public.notifications (clerk_id);
    END IF;
END $$;

-----------------------------------------------------------------------
-- STEP 3: Update RLS policies for notifications
-----------------------------------------------------------------------

-- Enable Row Level Security if not already enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

-- Create updated policies with dual authentication support
-- This supports both auth.uid() and clerk_id to ensure compatibility
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (
    user_id = auth.uid() OR 
    clerk_id = auth.jwt() ->> 'user_id'
);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (
    user_id = auth.uid() OR 
    clerk_id = auth.jwt() ->> 'user_id'
);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (
    user_id = auth.uid() OR 
    clerk_id = auth.jwt() ->> 'user_id'
);

-- Add a new policy for inserting notifications
CREATE POLICY "Users can insert their own notifications"
ON public.notifications FOR INSERT
WITH CHECK (
    user_id = auth.uid() OR 
    clerk_id = auth.jwt() ->> 'user_id'
);

-- Add policy for admins to view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE clerk_id = auth.jwt() ->> 'user_id' AND role = 'admin'
    )
);

-----------------------------------------------------------------------
-- STEP 4: Update notification functions to support clerk_id
-----------------------------------------------------------------------

-- Update the get_user_notifications function to support clerk_id
CREATE OR REPLACE FUNCTION public.get_user_notifications(
    user_id_param UUID DEFAULT NULL,
    clerk_id_param TEXT DEFAULT NULL,
    limit_param INT DEFAULT 50
)
RETURNS SETOF notifications AS $$
BEGIN
    -- Determine which parameter to use
    IF clerk_id_param IS NOT NULL THEN
        -- Use clerk_id if provided
        RETURN QUERY
        SELECT *
        FROM notifications
        WHERE clerk_id = clerk_id_param
        ORDER BY created_at DESC
        LIMIT limit_param;
    ELSIF user_id_param IS NOT NULL THEN
        -- Fall back to user_id if provided
        RETURN QUERY
        SELECT *
        FROM notifications
        WHERE user_id = user_id_param
        ORDER BY created_at DESC
        LIMIT limit_param;
    ELSE
        -- If neither provided, use current auth context
        RETURN QUERY
        SELECT *
        FROM notifications
        WHERE 
            user_id = auth.uid() OR 
            clerk_id = auth.jwt() ->> 'user_id'
        ORDER BY created_at DESC
        LIMIT limit_param;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the mark_notification_read function
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    can_update BOOLEAN;
BEGIN
    -- Check if user has permission to update this notification
    SELECT EXISTS (
        SELECT 1 FROM notifications 
        WHERE id = notification_id_param AND 
            (user_id = auth.uid() OR clerk_id = auth.jwt() ->> 'user_id')
    ) INTO can_update;
    
    -- Only update if user has permission
    IF can_update THEN
        UPDATE notifications
        SET read = true
        WHERE id = notification_id_param;
        
        RETURN FOUND;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the mark_all_notifications_read function to support clerk_id
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(
    user_id_param UUID DEFAULT NULL,
    clerk_id_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Determine which parameter to use
    IF clerk_id_param IS NOT NULL THEN
        -- Use clerk_id if provided
        UPDATE notifications
        SET read = true
        WHERE clerk_id = clerk_id_param AND read = false;
    ELSIF user_id_param IS NOT NULL THEN
        -- Fall back to user_id if provided
        UPDATE notifications
        SET read = true
        WHERE user_id = user_id_param AND read = false;
    ELSE
        -- If neither provided, use current auth context
        UPDATE notifications
        SET read = true
        WHERE (user_id = auth.uid() OR clerk_id = auth.jwt() ->> 'user_id') AND read = false;
    END IF;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the delete_notification function
CREATE OR REPLACE FUNCTION public.delete_notification(notification_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    can_delete BOOLEAN;
BEGIN
    -- Check if user has permission to delete this notification
    SELECT EXISTS (
        SELECT 1 FROM notifications 
        WHERE id = notification_id_param AND 
            (user_id = auth.uid() OR clerk_id = auth.jwt() ->> 'user_id')
    ) INTO can_delete;
    
    -- Only delete if user has permission
    IF can_delete THEN
        DELETE FROM notifications
        WHERE id = notification_id_param;
        
        RETURN FOUND;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a new function to help migrate from user_id to clerk_id
CREATE OR REPLACE FUNCTION public.associate_notification_clerk_ids()
RETURNS INT AS $$
DECLARE
    update_count INT;
BEGIN
    -- Update notifications to add clerk_id where it's null but user_id exists
    WITH profile_lookup AS (
        SELECT id AS user_id, clerk_id 
        FROM profiles 
        WHERE clerk_id IS NOT NULL
    )
    UPDATE notifications n
    SET clerk_id = p.clerk_id
    FROM profile_lookup p
    WHERE n.user_id = p.user_id AND n.clerk_id IS NULL;
    
    GET DIAGNOSTICS update_count = ROW_COUNT;
    RETURN update_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-----------------------------------------------------------------------
-- STEP 5: Enable realtime for notifications
-----------------------------------------------------------------------

-- Make sure the table is added to the realtime publication
DO $$
BEGIN
    -- Check if the publication exists
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        -- Use dynamic SQL to avoid errors if the table is already in the publication
        EXECUTE format(
            'ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS public.notifications'
        );
    END IF;
END $$;

-----------------------------------------------------------------------
-- STEP 6: Grant permissions and migrate data
-----------------------------------------------------------------------

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.associate_notification_clerk_ids TO authenticated;

-- If we backed up data, restore it
DO $$
BEGIN
    -- Count rows in temp backup
    IF (SELECT COUNT(*) FROM public.temp_notifications_backup) > 0 THEN
        -- Insert data from backup if notifications table is empty
        IF (SELECT COUNT(*) FROM public.notifications) = 0 THEN
            INSERT INTO public.notifications (
                id, user_id, type, title, message, data, read, created_at
            )
            SELECT 
                id, user_id, type, title, message, data, read, created_at
            FROM 
                public.temp_notifications_backup;
                
            -- Run the association function to populate clerk_id
            PERFORM public.associate_notification_clerk_ids();
        END IF;
    END IF;
END $$;

-- Clean up backup table
DROP TABLE IF EXISTS public.temp_notifications_backup;