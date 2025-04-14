
import React, { useState, useCallback, memo } from 'react';
import { useClerkTransactionForm } from '@/context/TransactionForm/ClerkTransactionFormContext';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

// Define types for documents
type DocumentType = 'Contract' | 'Agreement' | 'Invoice' | 'Receipt' | 'Other';

interface TransactionDocument {
  name: string;
  documentType: DocumentType;
  file: File;
  url?: string;
}

// Memoized component to prevent unnecessary re-renders
const DocumentUpload: React.FC = memo(() => {
  const { state, addDocument, removeDocument, nextStep, prevStep } = useClerkTransactionForm();
  const { documents } = state;

  // Local state for document form
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('Contract');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoized handlers to prevent recreating functions on each render
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }

      setFile(selectedFile);

      // Use file name as document name if not set
      if (!documentName) {
        const baseName = selectedFile.name.split('.')[0];
        setDocumentName(baseName);
      }

      setError(null);
    }
  }, [documentName]);

  const handleAddDocument = useCallback(() => {
    if (!documentName.trim()) {
      setError('Document name is required');
      return;
    }

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Create document object
    const newDocument: TransactionDocument = {
      name: documentName,
      documentType: documentType,
      file: file,
      url: URL.createObjectURL(file) // Add a temporary URL for preview
    };

    // Add to form state
    addDocument(newDocument);

    // Reset form
    setDocumentName('');
    setDocumentType('Contract');
    setFile(null);
    setError(null);

    // Reset file input
    const fileInput = document.getElementById('document-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, [documentName, documentType, file, addDocument]);

  const handleRemoveDocument = useCallback((index: number) => {
    removeDocument(index);
  }, [removeDocument]);

  const handleContinue = useCallback(() => {
    // Documents are optional, so we can always proceed
    nextStep();
  }, [nextStep]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload Documents</h2>
      <p className="text-muted-foreground">
        Upload any relevant documents for this transaction. This is optional and can be done later.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Document</CardTitle>
              <CardDescription>
                Upload contracts, agreements, and other supporting documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="document-name">Document Name</Label>
                <Input
                  id="document-name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select
                  value={documentType}
                  onValueChange={(value) => setDocumentType(value as DocumentType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Agreement">Agreement</SelectItem>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                    <SelectItem value="Receipt">Receipt</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="document-file">File</Label>
                <div className="mt-1">
                  <Input
                    id="document-file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported file types: PDF, Word, JPG, PNG (max 5MB)
                </p>
              </div>

              {error && (
                <div className="flex items-center text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddDocument} disabled={!documentName || !file}>
                <Upload className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                {documents.length === 0
                  ? 'No documents uploaded yet'
                  : `${documents.length} document${documents.length === 1 ? '' : 's'} uploaded`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
});

// Add display name for debugging
DocumentUpload.displayName = 'DocumentUpload';

export default DocumentUpload;
