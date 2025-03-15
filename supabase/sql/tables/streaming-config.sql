
-- Table to store streaming configuration
CREATE TABLE IF NOT EXISTS public.streaming_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agora_app_id TEXT,
  agora_app_certificate TEXT,
  agora_enabled BOOLEAN DEFAULT true,
  max_stream_duration INTEGER DEFAULT 120, -- in minutes
  streamer_cooldown INTEGER DEFAULT 15, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table to log admin actions
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users NOT NULL,
  action_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Proper permissions for streaming_config
ALTER TABLE public.streaming_config ENABLE ROW LEVEL SECURITY;

-- Only authenticated users with admin role can view or edit streaming config
CREATE POLICY "Admins can manage streaming config" 
  ON public.streaming_config 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Set permissions for admin_actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin actions
CREATE POLICY "Admins can view admin actions" 
  ON public.admin_actions 
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Only admins can insert admin actions
CREATE POLICY "Admins can create admin action logs" 
  ON public.admin_actions 
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
