
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Loader2, AlertTriangle, Info, RefreshCcw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  maxDocuments?: number;
  maxSizeMB?: number;
  disabled?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  maxDocuments = 20,
  maxSizeMB = 10,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { uploadFile, checkStorageBuckets, forceCheckStorageBuckets, testBucketAccess, isUploading, progress } = useStorageUpload();
  const [documentType, setDocumentType] = useState<string>('Contract');
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Check storage bucket on mount
  useEffect(() => {
    const verifyStorageBucket = async () => {
      try {
        setDebugInfo(`Checking document storage bucket (retry: ${retryCount})`);
        setBucketStatus('checking');
        
        // Use force check if it's a retry
        const bucketsExist = retryCount > 0
          ? await forceCheckStorageBuckets(['property-documents'])
          : await checkStorageBuckets(['property-documents']);
        
        if (!bucketsExist) {
          console.warn('Property documents bucket not found. Trying direct access...');
          setDebugInfo('Trying direct bucket access...');
          
          // Try direct bucket access as a fallback
          const directAccess = await testBucketAccess('property-documents');
          
          if (directAccess) {
            setDebugInfo('Direct bucket access successful');
            setBucketStatus('available');
            if (retryCount > 0) {
              toast.success('Successfully connected to document storage');
            }
            return;
          }
          
          setDebugInfo('Failed both bucket listing and direct access');
          setBucketStatus('unavailable');
          
          if (retryCount > 0) {
            toast.warning('Storage bucket is still not accessible. Please check if the "Property Documents" bucket exists in Supabase.');
          }
        } else {
          setDebugInfo('Document storage bucket verified');
          setBucketStatus('available');
          if (retryCount > 0) {
            toast.success('Successfully connected to document storage');
          }
        }
      } catch (error) {
        console.error('Error checking document storage bucket:', error);
        setDebugInfo(`Error checking document bucket: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setBucketStatus('unavailable');
        
        if (retryCount > 0) {
          toast.error('Failed to connect to document storage');
        }
      }
    };
    
    verifyStorageBucket();
  }, [checkStorageBuckets, forceCheckStorageBuckets, testBucketAccess, retryCount]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset any previous errors
    setUploadError(null);
    
    // Check if we're already at maximum documents
    if (state.documents.length + acceptedFiles.length > maxDocuments) {
      toast.error(`You can only upload a maximum of ${maxDocuments} documents`);
      return;
    }

    // Verify storage bucket access
    if (bucketStatus !== 'available') {
      setUploadError('Storage bucket is not accessible. Please check your connection and try again.');
      return;
    }

    // Track files being processed
    const fileNames = acceptedFiles.map(file => file.name);
    setProcessingFiles(prev => [...prev, ...fileNames]);

    try {
      for (const file of acceptedFiles) {
        // Add to form state immediately with required properties
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Create a preview URL for the document
        const previewUrl = URL.createObjectURL(file);
        
        addDocument({
          id: docId,
          file,
          name: file.name,
          documentType,
          url: previewUrl, // Temporary URL for preview
          uploadStatus: 'uploading'
        });

        try {
          setDebugInfo(`Uploading document: ${file.name} to property-documents/${documentType.toLowerCase()}`);
          
          // Upload file to Supabase storage
          const uploadedUrl = await uploadFile(file, {
            bucket: 'property-documents',
            path: `documents/${documentType.toLowerCase()}`,
            maxSizeMB,
            acceptedFileTypes: [
              'application/pdf', 
              'application/msword', 
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'image/jpeg',
              'image/png'
            ]
          });
          
          setDebugInfo(`Document upload successful: ${uploadedUrl}`);
          
          // Find the document in state and update its status
          const docIndex = state.documents.findIndex(doc => doc.id === docId);
          if (docIndex !== -1) {
            const updatedDocs = [...state.documents];
            updatedDocs[docIndex] = {
              ...updatedDocs[docIndex],
              url: uploadedUrl,
              uploadStatus: 'success'
            };
            // Update the form state with the new document status
            // Since we don't have updateDocumentStatus in the context, we'll remove and re-add
            removeDocument(docIndex);
            addDocument(updatedDocs[docIndex]);
          }
          
          console.log(`Successfully uploaded document: ${file.name}`, uploadedUrl);
        } catch (error: any) {
          console.error('Error uploading document:', error);
          setDebugInfo(`Document upload error: ${error.message || 'Unknown error'}`);
          setUploadError(`Error uploading: ${error.message || 'Unknown error'}`);
          
          // Update document status to error
          const docIndex = state.documents.findIndex(doc => doc.id === docId);
          if (docIndex !== -1) {
            const updatedDocs = [...state.documents];
            updatedDocs[docIndex] = {
              ...updatedDocs[docIndex],
              uploadStatus: 'error'
            };
            // Update the form state with the error status
            removeDocument(docIndex);
            addDocument(updatedDocs[docIndex]);
          }
        }
      }
      
      toast.success(`Added ${acceptedFiles.length} document(s)`);
    } finally {
      // Remove files from processing state
      setProcessingFiles(prev => prev.filter(name => !fileNames.includes(name)));
    }
  }, [state.documents, addDocument, removeDocument, documentType, maxDocuments, maxSizeMB, uploadFile, bucketStatus]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: disabled || bucketStatus !== 'available'
  });

  const handleRemoveDocument = (index: number) => {
    removeDocument(index);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Manually trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const retryBucketCheck = () => {
    setRetryCount(prev => prev + 1);
    setDebugInfo("Retrying document bucket connection...");
  };

  return (
    <div className="space-y-4">
      {bucketStatus === 'checking' && (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <AlertDescription>
            Checking document storage configuration...
          </AlertDescription>
        </Alert>
      )}

      {bucketStatus === 'unavailable' && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertTitle>Document Storage Issue</AlertTitle>
          <AlertDescription>
            <p>Document storage is not accessible. Please check if the "Property Documents" bucket exists in Supabase.</p>
            <div className="flex flex-col space-y-1 text-sm mt-2">
              <p className="font-semibold flex items-center">
                <Info className="h-3 w-3 mr-1" /> Troubleshooting:
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Ensure the 'property-documents' bucket exists in your Supabase storage</li>
                <li>Check that your bucket has the correct RLS policies for uploads</li>
                <li>Verify that you are authenticated if the bucket requires authentication</li>
              </ol>
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryBucketCheck} 
                className="self-start flex items-center mt-2"
              >
                <RefreshCcw className="h-3 w-3 mr-2" />
                Retry Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="self-start flex items-center mt-2"
                asChild
              >
                <a href="https://supabase.com/dashboard/project/synabhmsxsvsxkyzhfss/storage/buckets" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Open Supabase Storage
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      {debugInfo && (
        <Alert variant="default" className="mb-4 bg-muted/50">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription className="font-mono text-xs">Debug: {debugInfo}</AlertDescription>
        </Alert>
      )}

      <div className="mb-4">
        <Label htmlFor="documentType">Document Type</Label>
        <Select value={documentType} onValueChange={(value) => setDocumentType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Agreement">Agreement</SelectItem>
            <SelectItem value="Brochure">Brochure</SelectItem>
            <SelectItem value="FloorPlan">Floor Plan</SelectItem>
            <SelectItem value="LegalDocument">Legal Document</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          bucketStatus !== 'available' || disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <input {...getInputProps()} ref={fileInputRef} disabled={bucketStatus !== 'available' || disabled} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag & drop property documents</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse (max {maxSizeMB}MB per document)
          </p>
          <Button 
            type="button" 
            variant="secondary" 
            className="mt-2" 
            onClick={handleSelectClick}
            disabled={bucketStatus !== 'available' || disabled}
          >
            <FileText className="h-4 w-4 mr-2" />
            Select Documents
          </Button>
          {isUploading && (
            <div className="mt-2 flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Uploading... {progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Documents Preview */}
      {state.documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
          <div className="space-y-2">
            {state.documents.map((doc, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {doc.uploadStatus === 'uploading' && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-muted-foreground" />
                  )}
                  {doc.uploadStatus === 'error' && (
                    <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                  )}
                  {doc.uploadStatus === 'success' && (
                    <div className="text-xs bg-green-500 text-white px-2 py-0.5 rounded mr-2">
                      Uploaded
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
