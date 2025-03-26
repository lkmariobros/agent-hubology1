import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload, Building, Home, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TransactionFormValues } from '@/types';

// Validation schema
const transactionSchema = z.object({
  transactionType: z.enum(['individual', 'developer']),
  transactionDate: z.date(),
  status: z.string(),
  propertyId: z.string().min(1, 'Property is required'),
  agentId: z.string().min(1, 'Agent is required'),
  buyer: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    notes: z.string().optional()
  }).optional(),
  seller: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    notes: z.string().optional()
  }).optional(),
  transactionValue: z.coerce.number().min(1, 'Value must be greater than 0'),
  commissionRate: z.coerce.number().min(0, 'Commission rate cannot be negative'),
  commissionAmount: z.coerce.number().min(0, 'Commission amount cannot be negative'),
  notes: z.string().optional(),
});

// Define the form values type based on the schema
type FormValues = z.infer<typeof transactionSchema>;

const TransactionForm = () => {
  const navigate = useNavigate();
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionType: 'individual',
      transactionDate: new Date(),
      status: 'pending',
      propertyId: '',
      agentId: '',
      transactionValue: 0,
      commissionRate: 5,
      commissionAmount: 0,
      notes: '',
    },
  });

  const transactionType = form.watch('transactionType');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setDocumentFiles([...documentFiles, ...newFiles]);
      toast.success(`${newFiles.length} document(s) added`);
    }
  };

  const removeDocument = (index: number) => {
    setDocumentFiles(documentFiles.filter((_, i) => i !== index));
    toast.info('Document removed');
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add the files to form data
      const formData = {
        ...data,
        documents: documentFiles,
      };
      
      console.log('Transaction submitted:', formData);
      
      // Here you would normally send the data to your API
      // For now, we'll just simulate a successful submission
      toast.success('Transaction created successfully!');
      setTimeout(() => {
        navigate('/transactions');
      }, 1500);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('Failed to create transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Type Selection */}
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="individual" className="gap-2">
                        <Home className="h-4 w-4" />
                        Individual Property
                      </ToggleGroupItem>
                      <ToggleGroupItem value="developer" className="gap-2">
                        <Building className="h-4 w-4" />
                        Developer Project
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pending" id="status-pending" />
                            <FormLabel htmlFor="status-pending" className="font-normal">
                              Pending
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="in-progress" id="status-progress" />
                            <FormLabel htmlFor="status-progress" className="font-normal">
                              In Progress
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="completed" id="status-completed" />
                            <FormLabel htmlFor="status-completed" className="font-normal">
                              Completed
                            </FormLabel>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Property Selection */}
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property</FormLabel>
                  <FormControl>
                    <Input placeholder="Select property..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the property ID or name associated with this transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Information based on transaction type */}
            {transactionType === 'individual' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buyer Information */}
                <FormField
                  control={form.control}
                  name="buyer.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter buyer name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Seller Information */}
                <FormField
                  control={form.control}
                  name="seller.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter seller name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter developer information..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Transaction Value and Commission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="transactionValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Value</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-7" 
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(e);
                            // Auto-calculate commission (5% of transaction value)
                            if (!isNaN(value)) {
                              form.setValue('commissionAmount', Math.round(value * 0.05));
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commissionAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-7" 
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
              <FormLabel>Documents</FormLabel>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">Drag and drop files or click to upload</p>
                <label htmlFor="document-upload">
                  <Input
                    id="document-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Select Files
                  </Button>
                </label>
              </div>

              {/* Document List */}
              {documentFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Uploaded Documents:</p>
                  <ul className="space-y-2">
                    {documentFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional information about this transaction..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/transactions')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Transaction'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
