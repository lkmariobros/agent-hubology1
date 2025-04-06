
import React, { useState } from 'react';
import { Upload, File, FileText, X, Loader2 } from 'lucide-react';
import { usePropertyForm } from '@/context/PropertyForm';
import { PropertyDocument } from '@/types/property-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { v4 as uuidv4 } from 'uuid';

const documentTypes = [
  'Floor Plan',
  'Title Deed',
  'Property Agreement',
  'Inspection Report',
  'Payment Schedule',
  'Legal Document',
  'Other'
];

const PropertyDocuments: React.FC = () => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { uploadFile, isUploading } = useStorageUpload();
  const [documentType, setDocumentType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    // Validate file type
    if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|image/jpeg|image/png')) {
      toast.error('Unsupported file type. Please upload a PDF, Word, Excel, or image file.');
      return;
    }
    
    // Check if document type is selected
    if (!documentType) {
      toast.error('Please select a document type first');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Upload the file to Supabase Storage
      const uploadedUrl = await uploadFile(file, {
        bucket: 'property-images',
        path: 'documents',
        maxSizeMB: 10,
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
      
      // Add document to state
      const newDocument: PropertyDocument = {
        id: uuidv4(),
        file,
        name: file.name,
        documentType,
        url: uploadedUrl,
        uploadStatus: 'success'
      };
      
      addDocument(newDocument);
      toast.success('Document uploaded successfully');
      setDocumentType(''); // Reset document type after successful upload
      
      // Reset the input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRemoveDocument = (index: number) => {
    removeDocument(index);
    toast.info('Document removed');
  };
  
  const getDocumentIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes('word')) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-6 w-6 text-green-500" />;
    } else if (fileType.includes('image')) {
      return <File className="h-6 w-6 text-purple-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Property Documents</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Upload important documents related to this property like floor plans, title deeds, etc.
        </p>
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
          <div className="w-full md:w-1/3">
            <Label htmlFor="documentType">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-2/3">
            <Label htmlFor="documentFile">Document File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="documentFile"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="flex-1"
                onChange={handleFileChange}
                disabled={isProcessing || isUploading || !documentType}
              />
              {(isProcessing || isUploading) && (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Upload PDF, Word, Excel, or image files (max 10MB)
            </p>
          </div>
        </div>
      </div>
      
      {/* Document List */}
      {state.documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.documents.map((document, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4 flex items-center">
                <div className="mr-4 flex-shrink-0">
                  {getDocumentIcon(document.file?.type || '')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{document.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {document.documentType}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveDocument(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-8 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No documents uploaded yet. Select a document type and upload files.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyDocuments;
