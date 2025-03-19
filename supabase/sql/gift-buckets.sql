
-- Create storage buckets for gift icons and sounds
INSERT INTO storage.buckets (id, name, public)
SELECT 'gift-icons', 'gift-icons', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gift-icons');

INSERT INTO storage.buckets (id, name, public)
SELECT 'gift-sounds', 'gift-sounds', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gift-sounds');

-- Set up storage permissions for gift icons
CREATE POLICY "Gift icons bucket is public for select" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'gift-icons');

CREATE POLICY "Authenticated users can upload gift icons" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'gift-icons');

CREATE POLICY "Users can update their own gift icon files" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'gift-icons' AND auth.uid() = owner::uuid);

-- Set up storage permissions for gift sounds
CREATE POLICY "Gift sounds bucket is public for select" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'gift-sounds');

CREATE POLICY "Authenticated users can upload gift sounds" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'gift-sounds');

CREATE POLICY "Users can update their own gift sound files" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'gift-sounds' AND auth.uid() = owner::uuid);
