
import React from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText, Upload, X, File } from 'lucide-react';
import { PropertyDocument } from '@/types/property-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PropertyDocumentsUpload: React.FC = () => {
  const { state, addDocument, removeDocument } = usePropertyForm();
  const { documents } = state;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Create a new document
      const newDocument: PropertyDocument = {
        file,
        name: file.name,
        documentType: 'Other', // Default type
        url: URL.createObjectURL(file),
      };
      
      addDocument(newDocument);
      
      // Reset the input
      e.target.value = '';
    }
  };

  const handleDocumentTypeChange = (index: number, type: string) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], documentType: type };
    // Remove and add to simulate updating the document
    removeDocument(index);
    addDocument(updatedDocuments[index]);
  };

  const handleNameChange = (index: number, name: string) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], name };
    // Remove and add to simulate updating the document
    removeDocument(index);
    addDocument(updatedDocuments[index]);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Documents</h3>
      
      <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Upload property-related documents such as floor plans, title deeds, etc.
        </p>
        <Label htmlFor="document-upload" className="cursor-pointer">
          <Button variant="outline" type="button">
            Select Document
          </Button>
          <Input
            id="document-upload"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Uploaded Documents ({documents.length})</h4>
          <div className="space-y-3">
            {documents.map((document, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 p-3 border rounded-md"
              >
                <div className="h-10 w-10 flex-shrink-0 bg-muted rounded-md flex items-center justify-center">
                  <File className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={document.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder="Document name"
                    className="w-full"
                  />
                  
                  <Select
                    value={document.documentType}
                    onValueChange={(value) => handleDocumentTypeChange(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Floor Plan">Floor Plan</SelectItem>
                      <SelectItem value="Title Deed">Title Deed</SelectItem>
                      <SelectItem value="Sales Brochure">Sales Brochure</SelectItem>
                      <SelectItem value="Legal Document">Legal Document</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
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
