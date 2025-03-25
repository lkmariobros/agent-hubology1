
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  maxFiles?: number;
  maxSizeMB?: number;
}

const documentTypes = [
  { value: 'floorPlan', label: 'Floor Plan' },
  { value: 'titleDeed', label: 'Title Deed' },
  { value: 'legalDocument', label: 'Legal Document' },
  { value: 'propertyInfo', label: 'Property Information' },
  { value: 'otherDocument', label: 'Other' }
];

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  maxFiles = 10,
  maxSizeMB = 10
}) => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { uploadFile, isUploading, progress } = useStorageUpload();
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Check if we're already at maximum documents
    if (state.documents.length + acceptedFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} documents`);
      return;
    }

    // Track files being processed
    const fileNames = acceptedFiles.map(file => file.name);
    setProcessingFiles(prev => [...prev, ...fileNames]);

    try {
      for (const file of acceptedFiles) {
        // Add to form state immediately
        addDocument({
          file,
          name: file.name,
          documentType: 'otherDocument', // Default type
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
  }, [state.documents, addDocument, maxFiles, maxSizeMB, uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: isUploading
  });

  const handleUpdateDocumentType = (index: number, type: string) => {
    const updatedDocuments = [...state.documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      documentType: type
    };
    
    // Update in context
    removeDocument(index);
    addDocument(updatedDocuments[index]);
  };

  const handleUpdateDocumentName = (index: number, name: string) => {
    const updatedDocuments = [...state.documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      name
    };
    
    // Update in context
    removeDocument(index);
    addDocument(updatedDocuments[index]);
  };

  const handleRemoveDocument = (index: number) => {
    removeDocument(index);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag & drop property documents</h3>
          <p className="text-sm text-muted-foreground">
            PDF, Word documents (max {maxSizeMB}MB per file)
          </p>
          {isUploading && (
            <div className="mt-2 flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Uploading... {progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Document List */}
      {state.documents.length > 0 && (
        <div className="space-y-3">
          {state.documents.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-80"
                onClick={() => handleRemoveDocument(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor={`doc-name-${index}`}>Document Name</Label>
                  <Input 
                    id={`doc-name-${index}`}
                    value={doc.name} 
                    onChange={(e) => handleUpdateDocumentName(index, e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`doc-type-${index}`}>Document Type</Label>
                  <Select 
                    value={doc.documentType} 
                    onValueChange={(value) => handleUpdateDocumentType(index, value)}
                  >
                    <SelectTrigger id={`doc-type-${index}`}>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                {doc.uploadStatus === 'uploading' ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : doc.file ? (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{doc.file.name} ({Math.round(doc.file.size / 1024)} KB)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{doc.name || 'Document'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
