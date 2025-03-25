
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from "lucide-react";

// Interface for document object
interface Document {
  id?: string;
  name: string;
  path?: string;
  file?: File;
  type: string;
  uploadStatus?: 'uploading' | 'success' | 'error' | 'completed';
  progress?: number;
  errorMessage?: string;
}

interface DocumentUploaderProps {
  documents: Document[];
  onAddDocument: (document: Document) => void;
  onRemoveDocument: (index: number) => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument,
  allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  maxSize = 10, // 10MB default
  maxFiles = 10,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Simplify allowed types for display
  const displayAllowedTypes = allowedTypes
    .map(type => type.replace('.', '').toUpperCase())
    .join(', ');
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return { valid: false, error: `File is too large. Maximum size is ${maxSize}MB.` };
    }
    
    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileExtension) && !allowedTypes.includes('*')) {
      return { valid: false, error: `File type not allowed. Allowed types: ${displayAllowedTypes}` };
    }
    
    return { valid: true };
  };
  
  const processFiles = (files: FileList | null) => {
    if (!files) return;
    
    // Check max files
    if (documents.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    Array.from(files).forEach(file => {
      const validation = validateFile(file);
      
      if (validation.valid) {
        // Create a new document object
        const newDocument: Document = {
          name: file.name,
          file: file,
          type: file.type,
          uploadStatus: 'completed', // Set as success since we're not actually uploading in this example
          progress: 100,
        };
        
        onAddDocument(newDocument);
      } else {
        // Handle invalid file
        alert(validation.error);
      }
    });
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    processFiles(e.dataTransfer.files);
  };
  
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleChooseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200'} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          transition-colors duration-200
          flex flex-col items-center justify-center text-center space-y-2
        `}
        onClick={disabled ? undefined : handleChooseFiles}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">Drag & Drop Documents</h3>
        <p className="text-sm text-muted-foreground">
          or click to browse your files
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: {displayAllowedTypes}
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {maxSize}MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          accept={allowedTypes.join(',')}
          disabled={disabled}
          className="hidden"
        />
      </div>
      
      {/* File List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Documents ({documents.length}/{maxFiles})</Label>
          <div className="border rounded-md divide-y">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type ? doc.type.split('/').pop()?.toUpperCase() : 'Document'}
                    </p>
                  </div>
                </div>
                
                {doc.uploadStatus && (
                  <div className="flex items-center space-x-2">
                    {doc.uploadStatus === 'uploading' && (
                      <>
                        <Progress value={doc.progress} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">{doc.progress}%</span>
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </>
                    )}
                    
                    {doc.uploadStatus === 'error' && (
                      <>
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>Error</span>
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 px-2"
                          onClick={() => onRemoveDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {(doc.uploadStatus === 'success' || doc.uploadStatus === 'completed') && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 px-2"
                          onClick={() => onRemoveDocument(index)}
                          disabled={disabled}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
                
                {!doc.uploadStatus && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2"
                    onClick={() => onRemoveDocument(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
