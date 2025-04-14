
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DocumentUploaderProps {
  maxDocuments?: number;
  maxSizeMB?: number;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  maxDocuments = 20,
  maxSizeMB = 10
}) => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { uploadFile, isUploading, progress } = useStorageUpload();
  const [documentType, setDocumentType] = useState<string>('Contract');
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Check if we're already at maximum documents
    if (state.documents.length + acceptedFiles.length > maxDocuments) {
      toast.error(`You can only upload a maximum of ${maxDocuments} documents`);
      return;
    }

    // Track files being processed
    const fileNames = acceptedFiles.map(file => file.name);
    setProcessingFiles(prev => [...prev, ...fileNames]);

    try {
      for (const file of acceptedFiles) {
        // Add to form state immediately with required properties
        addDocument({
          file,
          name: file.name,
          documentType,
          url: URL.createObjectURL(file), // Use temporary URL for preview
          uploadStatus: 'uploading'
        });

        try {
          // If connected to Supabase, try uploading
          if (window.location.hostname !== 'localhost') {
            await uploadFile(file, {
              bucket: 'property-documents',
              path: 'temp',
              maxSizeMB,
              acceptedFileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            });
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } finally {
      // Remove files from processing state
      setProcessingFiles(prev => prev.filter(name => !fileNames.includes(name)));
    }
  }, [state.documents, addDocument, documentType, maxDocuments, maxSizeMB, uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: isUploading
  });

  const handleRemoveDocument = (index: number) => {
    removeDocument(index);
  };

  return (
    <div className="space-y-4">
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
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag & drop property documents</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse (max {maxSizeMB}MB per document)
          </p>
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
