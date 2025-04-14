import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const StorageTest: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken, userId } = useAuth();

  // Load files from storage
  const loadFiles = async () => {
    setError(null);
    try {
      const token = await getToken({ template: 'supabase' });
      
      if (token) {
        // Set the JWT token for this request
        supabase.auth.setSession({ access_token: token, refresh_token: '' });
      } else {
        setError("No JWT token available");
        return;
      }

      // Get list of files from property-images bucket
      const { data, error: listError } = await supabase
        .storage
        .from('property-images')
        .list(userId || 'test');

      if (listError) {
        throw listError;
      }
      
      console.log('Files loaded:', data);
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
      setError(`Failed to load files: ${error.message || error}`);
      toast.error('Failed to load files');
    }
  };

  // Upload a test file
  const uploadTestFile = async () => {
    setError(null);
    setUploading(true);
    
    try {
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        setError("No JWT token available for uploading");
        setUploading(false);
        return;
      }
      
      // Set the JWT token for this request
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      
      // Create a simple text file
      const content = 'This is a test file created at ' + new Date().toISOString();
      const blob = new Blob([content], { type: 'text/plain' });
      const file = new File([blob], `test-${Date.now()}.txt`, { type: 'text/plain' });
      
      // Upload to a folder named with the user's clerk ID
      const filePath = `${userId || 'test'}/${file.name}`;
      
      console.log('Uploading file to path:', filePath);
      const { data, error: uploadError } = await supabase
        .storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      console.log('File uploaded:', data);
      toast.success('File uploaded successfully');
      
      // Refresh the file list
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(`Failed to upload file: ${error.message || error}`);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Delete a file
  const deleteFile = async (path: string) => {
    setError(null);
    try {
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        setError("No JWT token available for deleting");
        return;
      }
      
      // Set the JWT token for this request
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      
      // Delete the file
      const fullPath = `${userId || 'test'}/${path}`;
      console.log('Deleting file:', fullPath);
      
      const { error: deleteError } = await supabase
        .storage
        .from('property-images')
        .remove([fullPath]);

      if (deleteError) {
        throw deleteError;
      }
      
      console.log('File deleted successfully');
      toast.success('File deleted successfully');
      
      // Refresh the file list
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setError(`Failed to delete file: ${error.message || error}`);
      toast.error('Failed to delete file');
    }
  };

  // Get public URL for a file
  const getPublicUrl = (path: string) => {
    const fullPath = `${userId || 'test'}/${path}`;
    return supabase.storage.from('property-images').getPublicUrl(fullPath).data.publicUrl;
  };

  // Load files on mount
  useEffect(() => {
    if (userId) {
      loadFiles();
    }
  }, [userId]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Storage Test</CardTitle>
        <div className="text-sm text-blue-500">User ID: {userId}</div>
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button onClick={uploadTestFile} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Test File'}
          </Button>
          <Button onClick={loadFiles} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="space-y-2">
          {files.length > 0 ? (
            files.map((file) => (
              <Card key={file.name} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <div className="text-xs text-gray-400 mt-1">
                      Size: {Math.round(file.metadata?.size / 1024)} KB
                    </div>
                    {!file.name.endsWith('/') && (
                      <a 
                        href={getPublicUrl(file.name)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline mt-1 block"
                      >
                        View File
                      </a>
                    )}
                  </div>
                  {!file.name.endsWith('/') && (
                    <Button
                      onClick={() => deleteFile(file.name)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No files yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageTest;