
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, X, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PropertyDocument } from '@/types/property-form';

// Document types available for selection
const DOCUMENT_TYPES = [
  'Title Deed',
  'Floor Plan',
  'Brochure',
  'SPA',
  'Tenancy Agreement',
  'Valuation Report',
  'Other'
];

const PropertyDocumentsUpload: React.FC = () => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { documents } = state;
  const [documentType, setDocumentType] = useState('Other');
  const [documentName, setDocumentName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Reset error state
    setError(null);
    
    // Validate file
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, Word document, JPEG or PNG.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum file size is 5MB.');
      return;
    }
    
    // Validate document name
    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }
    
    // Create document object
    const newDocument: PropertyDocument = {
      file,
      name: documentName,
      documentType,
      uploadStatus: 'uploading'
    };
    
    // Add document to state
    addDocument(newDocument);
    
    // Reset form
    setDocumentName('');
  }, [addDocument, documentName, documentType]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Documents</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Document upload form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              placeholder="Enter document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            {isDragActive ? (
              <p>Drop the document here...</p>
            ) : (
              <p>Drag and drop a document, or click to select</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, Word, JPEG, PNG (max 5MB)
            </p>
          </div>
        </div>
      </div>
      
      {/* Documents list */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Uploaded Documents</h4>
          
          <div className="space-y-2">
            {documents.map((document, index) => (
              <div key={index} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-gray-500">{document.documentType}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocumentsUpload;
