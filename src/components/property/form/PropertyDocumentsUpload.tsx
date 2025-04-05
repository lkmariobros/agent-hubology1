
import React, { useState } from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUp, Trash2, FileText } from 'lucide-react';
import { PropertyDocument } from '@/types/property-form';

const documentTypes = [
  { value: 'floor-plan', label: 'Floor Plan' },
  { value: 'title-deed', label: 'Title Deed' },
  { value: 'brochure', label: 'Property Brochure' },
  { value: 'certificate', label: 'Building Certificate' },
  { value: 'other', label: 'Other Document' },
];

const PropertyDocumentsUpload: React.FC = () => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { documents } = state;
  
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!documentName) {
        // Use file name as document name if not provided
        setDocumentName(e.target.files[0].name.split('.')[0]);
      }
    }
  };
  
  const handleAddDocument = () => {
    if (file && documentName && documentType) {
      const newDocument: PropertyDocument = {
        name: documentName,
        documentType,
        file,
        uploadStatus: 'uploading'
      };
      
      addDocument(newDocument);
      
      // Reset form
      setDocumentName('');
      setDocumentType('');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('documentFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Documents</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="documentName">Document Name</Label>
          <Input
            id="documentName"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Enter document name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select
            value={documentType}
            onValueChange={setDocumentType}
          >
            <SelectTrigger id="documentType">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="documentFile">Upload Document</Label>
        <Input
          id="documentFile"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
      </div>
      
      <Button
        type="button"
        onClick={handleAddDocument}
        disabled={!file || !documentName || !documentType}
      >
        <FileUp className="mr-2 h-4 w-4" /> Add Document
      </Button>
      
      {documents.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Added Documents</h4>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {documentTypes.find(t => t.value === doc.documentType)?.label || doc.documentType}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
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
