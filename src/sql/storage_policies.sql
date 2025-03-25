
-- Create RLS policies for property-images bucket
-- Everyone can read images (they are public)
create policy "Public can read all images"
  on storage.objects
  for select
  using (bucket_id = 'property-images');

-- Only authenticated users can insert images 
create policy "Authenticated users can upload images"
  on storage.objects
  for insert
  with check (
    bucket_id = 'property-images' 
    and auth.role() = 'authenticated'
  );
  
-- Only owner or admin can update/delete images
create policy "Owners can update their own images"
  on storage.objects
  for update
  using (
    bucket_id = 'property-images' 
    and auth.uid() = owner
  );
  
create policy "Owners can delete their own images"
  on storage.objects
  for delete
  using (
    bucket_id = 'property-images' 
    and auth.uid() = owner
  );

-- Property documents are private
-- Only authenticated users can read documents
create policy "Authenticated users can read property documents"
  on storage.objects
  for select
  using (
    bucket_id = 'property-documents' 
    and auth.role() = 'authenticated'
  );

-- Only authenticated users can insert documents
create policy "Authenticated users can upload documents"
  on storage.objects
  for insert
  with check (
    bucket_id = 'property-documents' 
    and auth.role() = 'authenticated'
  );
  
-- Only owner or admin can update/delete documents
create policy "Owners can update their own documents"
  on storage.objects
  for update
  using (
    bucket_id = 'property-documents' 
    and auth.uid() = owner
  );
  
create policy "Owners can delete their own documents"
  on storage.objects
  for delete
  using (
    bucket_id = 'property-documents' 
    and auth.uid() = owner
  );
