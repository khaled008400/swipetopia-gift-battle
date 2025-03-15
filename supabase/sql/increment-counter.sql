
-- Function to increment a numeric column safely
CREATE OR REPLACE FUNCTION public.increment_counter(row_id UUID, counter_name TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_value INTEGER;
  new_value INTEGER;
BEGIN
  -- Get the current value
  EXECUTE format('SELECT %I FROM short_videos WHERE id = $1', counter_name)
  INTO current_value
  USING row_id;
  
  -- Calculate new value, handle NULL case
  new_value := COALESCE(current_value, 0) + 1;
  
  -- Return the new value
  RETURN new_value;
END;
$$;

-- Grant execution permission
GRANT EXECUTE ON FUNCTION public.increment_counter(UUID, TEXT) TO authenticated, anon;
