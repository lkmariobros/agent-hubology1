
import React, { useState, useCallback } from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { FileUp, X, FileText, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DocumentUpload: React.FC = () => {
  const { state, addDocument, removeDocument } = useTransactionForm();
  const { documents } = state;
  
  const [isDragging, setIsDragging] = useState(false);
  const [documentType, setDocumentType] = useState('Contract');
  
  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      // Check if file is valid (PDF or image)
      const isValidType = 
        file.type === 'application/pdf' || 
        file.type.startsWith('image/');
      
      if (!isValidType) {
        alert('Only PDF and image files are allowed.');
        return;
      }
      
      // Add document to state
      addDocument({
        name: file.name,
        file: file,
        documentType: documentType,
      });
    });
  }, [addDocument, documentType]);
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };
  
  // Get document type label based on transaction type
  const getDocumentTypes = () => {
    const commonTypes = [
      { value: 'Contract', label: 'Sales/Rental Contract' },
      { value: 'ID', label: 'ID Document' },
      { value: 'Proof', label: 'Proof of Address' },
      { value: 'Legal', label: 'Legal Document' },
      { value: 'Other', label: 'Other' },
    ];
    
    return commonTypes;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Document Upload</h2>
      <p className="text-muted-foreground">
        Upload any relevant documents for this transaction. Only PDF and image files are supported.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex space-x-3">
            <div className="flex-grow">
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={documentType}
                onValueChange={setDocumentType}
              >
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {getDocumentTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Label htmlFor="file-upload" className="sr-only">
                Choose file
              </Label>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="relative overflow-hidden"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Browse Files
                  <Input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileInputChange}
                    multiple
                    accept="application/pdf,image/*"
                  />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Drag and drop area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileUp className={`h-8 w-8 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported file types: PDF, JPG, PNG
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Uploaded Documents</h3>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {documents.length === 0 ? (
              <Card className="bg-muted/30">
                <CardContent className="p-4 flex items-center justify-center text-muted-foreground">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  No documents uploaded
                </CardContent>
              </Card>
            ) : (
              documents.map((doc, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <div className="text-sm font-medium truncate max-w-[160px]">
                            {doc.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {doc.documentType}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full text-muted-foreground hover:text-destructive"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
