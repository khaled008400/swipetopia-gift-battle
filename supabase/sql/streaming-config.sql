
-- Create a secure function to get streaming config
CREATE OR REPLACE FUNCTION public.get_streaming_config()
RETURNS TABLE (
  id UUID,
  agora_app_id TEXT,
  agora_app_certificate TEXT,
  agora_enabled BOOLEAN,
  max_stream_duration INTEGER,
  streamer_cooldown INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.agora_app_id,
    sc.agora_app_certificate,
    sc.agora_enabled,
    sc.max_stream_duration,
    sc.streamer_cooldown,
    sc.created_at,
    sc.updated_at
  FROM public.streaming_config sc
  LIMIT 1;
END;
$$;

-- Create a secure function to update streaming config
CREATE OR REPLACE FUNCTION public.update_streaming_config(
  p_app_id TEXT,
  p_app_certificate TEXT,
  p_enabled BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.streaming_config
  SET 
    agora_app_id = p_app_id,
    agora_app_certificate = p_app_certificate,
    agora_enabled = p_enabled,
    updated_at = NOW()
  WHERE id = (SELECT id FROM public.streaming_config LIMIT 1);
  
  -- Insert a default row if none exists
  IF NOT FOUND THEN
    INSERT INTO public.streaming_config (
      agora_app_id, 
      agora_app_certificate, 
      agora_enabled
    )
    VALUES (
      p_app_id,
      p_app_certificate,
      p_enabled
    );
  END IF;
END;
$$;

-- Create a secure function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action_type TEXT,
  p_target_id UUID,
  p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_actions (
    action_type,
    target_id,
    reason,
    admin_id
  )
  VALUES (
    p_action_type,
    p_target_id,
    p_reason,
    auth.uid()
  );
END;
$$;

-- Set appropriate permissions
GRANT EXECUTE ON FUNCTION public.get_streaming_config() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_streaming_config(TEXT, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action(TEXT, UUID, TEXT) TO authenticated;
