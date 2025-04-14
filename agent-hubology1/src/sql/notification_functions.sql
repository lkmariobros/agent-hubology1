
-- Function to get user notifications
CREATE OR REPLACE FUNCTION get_user_notifications(user_id_param UUID)
RETURNS SETOF notifications AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM notifications
  WHERE user_id = user_id_param
  ORDER BY created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark a notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications
  SET read = true
  WHERE id = notification_id_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all user notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications
  SET read = true
  WHERE user_id = user_id_param AND read = false;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a notification
CREATE OR REPLACE FUNCTION delete_notification(notification_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM notifications
  WHERE id = notification_id_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
