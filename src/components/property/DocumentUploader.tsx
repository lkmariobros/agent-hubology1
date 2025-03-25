
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  label?: string;
  description?: string;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error' | 'completed'; // Added 'completed' as a valid status
  progress: number;
  error?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  accept = '.pdf,.doc,.docx,.xlsx,.xls',
  maxSize = 10, // 10MB default
  maxFiles = 5,
  label = 'Upload Documents',
  description = 'Upload PDF, Word, or Excel documents'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };
  
  const handleFiles = (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    
    const validFiles = files.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB <= maxSize;
    });
    
    if (validFiles.length !== files.length) {
      alert(`Some files were too large. Maximum file size is ${maxSize}MB.`);
    }
    
    const newUploadedFiles = [
      ...uploadedFiles,
      ...validFiles.map(file => ({
        file,
        status: 'uploading' as const,
        progress: 0
      }))
    ];
    
    setUploadedFiles(newUploadedFiles);
    onUpload(validFiles);
    
    // Simulate upload progress and completion
    validFiles.forEach((file, index) => {
      const fileIndex = uploadedFiles.length + index;
      
      const simulateProgress = () => {
        setUploadedFiles(prev => {
          const updated = [...prev];
          if (updated[fileIndex]) {
            updated[fileIndex].progress += 10;
            
            if (updated[fileIndex].progress >= 100) {
              updated[fileIndex].status = 'completed';
              clearInterval(intervalId);
            }
          }
          return updated;
        });
      };
      
      const intervalId = setInterval(simulateProgress, 300);
    });
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label>{label}</Label>
        <div 
          className={cn(
            "mt-2 border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors",
            isDragging && "border-primary bg-accent/50",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
          tabIndex={0}
          role="button"
          aria-label="Upload documents"
        >
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept={accept} 
            multiple 
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {isDragging ? 'Drop files here' : 'Drag and drop or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum file size: {maxSize}MB
            </p>
          </div>
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Documents</p>
          <div className="divide-y">
            {uploadedFiles.map((uploadedFile, index) => (
              <div key={index} className="py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(uploadedFile.file.name)}
                  <div>
                    <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {uploadedFile.status === 'uploading' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${uploadedFile.progress}%` }}
                        ></div>
                      </div>
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : uploadedFile.status === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-8 w-8 p-0"
                    onClick={() => removeFile(index)}
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
