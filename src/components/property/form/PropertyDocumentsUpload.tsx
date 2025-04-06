
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileX, FileUp, File as FileIcon, X, Loader2 } from 'lucide-react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { PropertyDocument } from '@/types/property-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const documentTypes = [
  { id: 'sale_purchase', label: 'Sale & Purchase Agreement' },
  { id: 'floorplan', label: 'Floor Plan' },
  { id: 'brochure', label: 'Property Brochure' },
  { id: 'title', label: 'Title Deed' },
  { id: 'valuation', label: 'Valuation Report' },
  { id: 'photos', label: 'Additional Photos' },
  { id: 'legal', label: 'Legal Documents' },
  { id: 'other', label: 'Other' }
];

const PropertyDocumentsUpload: React.FC = () => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { uploadFile, isUploading, progress } = useStorageUpload();
  const [selectedDocType, setSelectedDocType] = useState(documentTypes[0].id);
  const [documentName, setDocumentName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size exceeds 10MB limit");
      toast.error("File size exceeds 10MB limit");
      return;
    }

    // Use the file name if no document name is provided
    const displayName = documentName.trim() || file.name;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create document with temporary state
      const docId = `doc-${Date.now()}`;
      
      const newDocument: PropertyDocument = {
        id: docId,
        file,
        name: displayName,
        documentType: selectedDocType,
        url: 'pending-upload',
        uploadStatus: 'uploading'
      };
      
      // Add to form state
      addDocument(newDocument);
      
      // Upload file to Supabase
      const uploadedUrl = await uploadFile(file, {
        bucket: 'property-documents',
        path: 'documents',
        maxSizeMB: 10,
        acceptedFileTypes: [
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
      });
      
      // Find the index of the document in the array
      const docIndex = state.documents.findIndex(doc => doc.id === docId);
      
      if (docIndex !== -1) {
        // Remove the existing document
        removeDocument(docIndex);
        
        // Add the updated document
        const updatedDocument: PropertyDocument = {
          id: docId,
          name: displayName,
          documentType: selectedDocType,
          url: uploadedUrl,
          uploadStatus: 'success'
        };
        
        addDocument(updatedDocument);
      }
      
      toast.success('Document uploaded successfully');
      
      // Reset form
      setDocumentName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error: any) {
      setError(error.message || 'Failed to upload document');
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    removeDocument(index);
    toast.success('Document removed');
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Property Documents</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Add important documents related to this property (max 10MB per document)
        </p>
        
        <Card className="p-4">
          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select 
                  value={selectedDocType}
                  onValueChange={setSelectedDocType}
                >
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="document-name">Document Name (Optional)</Label>
                <Input
                  id="document-name"
                  placeholder="e.g. Floor Plan 2023"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              />
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-20 border-dashed border-2"
                onClick={handleUploadClick}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Uploading... {progress}%
                  </>
                ) : (
                  <>
                    <FileUp className="h-5 w-5 mr-2" />
                    Click to select a document
                  </>
                )}
              </Button>
              
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, Word, Excel, JPG, PNG (Max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Document List */}
      {state.documents.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Uploaded Documents ({state.documents.length})</h4>
          
          <div className="grid gap-3">
            {state.documents.map((doc, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-md border",
                  doc.uploadStatus === 'uploading' ? "bg-muted/50" : "",
                  doc.uploadStatus === 'error' ? "border-destructive bg-destructive/10" : ""
                )}
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {documentTypes.find(t => t.id === doc.documentType)?.label || doc.documentType}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {doc.uploadStatus === 'uploading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocumentsUpload;
