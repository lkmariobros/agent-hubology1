
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { File, Upload, X, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { PropertyDocument } from '@/types/property-form';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const DOCUMENT_TYPES = [
  'Sales and Purchase Agreement',
  'Floor Plan',
  'Title Deed',
  'Property Valuation',
  'Land Survey',
  'Building Permit',
  'Insurance Document',
  'Lease Agreement',
  'Tax Receipt',
  'Other'
];

const PropertyDocuments: React.FC = () => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>(DOCUMENT_TYPES[0]);
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
      
      // Reset the input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Process selected files
  const handleFiles = (files: File[]) => {
    const acceptedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];
    
    const validFiles = files.filter(file => acceptedTypes.includes(file.type));
    
    if (validFiles.length === 0) {
      toast.error('Please select valid document files (PDF, Word, Excel, or images)');
      return;
    }
    
    // Size validation (10MB limit)
    const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the 10MB size limit`);
      return;
    }
    
    // Add documents to state
    validFiles.forEach(file => {
      const newDocument: PropertyDocument = {
        id: uuidv4(),
        file,
        name: file.name,
        documentType: selectedDocType,
        url: URL.createObjectURL(file),
        uploadStatus: 'uploading' // We'll set this to 'success' after upload
      };
      
      addDocument(newDocument);
    });
    
    if (validFiles.length > 0) {
      toast.success(`Added ${validFiles.length} document(s)`);
    }
  };
  
  // Handle button click
  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Remove document
  const handleRemoveDocument = (index: number) => {
    // Release object URL if it exists
    if (state.documents[index]?.url) {
      URL.revokeObjectURL(state.documents[index].url);
    }
    
    removeDocument(index);
    toast.info('Document removed');
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-full max-w-xs">
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            "cursor-pointer"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleSelectClick}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Drag & drop property documents</h3>
            <p className="text-sm text-muted-foreground">
              or click to browse (max 10MB per file)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
            <Button 
              type="button" 
              variant="secondary" 
              className="mt-2"
            >
              Select Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              PDF, Word, Excel, JPG, PNG accepted
            </p>
          </div>
        </div>
      </div>
      
      {/* Document list */}
      {state.documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Document List ({state.documents.length})</h3>
          
          <div className="grid gap-4">
            {state.documents.map((doc, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-10 w-10 rounded flex items-center justify-center">
                      <File className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                      {doc.uploadStatus === 'uploading' && (
                        <div className="flex items-center mt-1">
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          <span className="text-xs">Preparing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDocument(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocuments;
