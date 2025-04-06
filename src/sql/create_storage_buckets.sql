
-- Check if property-images bucket exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('property-images', 'Property Images', true);
  END IF;
END $$;

-- Create a public policy for the property-images bucket
-- Allow anyone to read images
CREATE POLICY IF NOT EXISTS "Public can read property images"
  ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'property-images');

-- Allow authenticated users to upload images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload property images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow owners to update/delete their images
CREATE POLICY IF NOT EXISTS "Users can update their own property images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'property-images' 
    AND auth.uid() = owner
  );

CREATE POLICY IF NOT EXISTS "Users can delete their own property images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'property-images' 
    AND auth.uid() = owner
  );
