
import React from 'react';
import { AlertCircle, BookOpen, Code, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type DocStatus = 'stable' | 'beta' | 'deprecated';

interface ComponentDocProps {
  /** Component name */
  title: string;
  /** Brief description of the component */
  description: string;
  /** Component status */
  status?: DocStatus;
  /** Whether this documentation should never be deleted */
  critical?: boolean;
  /** Example usage snippets */
  examples?: {
    title: string;
    code: string;
    description?: string;
  }[];
  /** Component props documentation */
  props?: {
    name: string;
    type: string;
    required?: boolean;
    default?: string;
    description: string;
  }[];
  /** Additional notes */
  notes?: string;
  /** Related components */
  seeAlso?: string[];
  /** Custom class name */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
}

export function ComponentDoc({
  title,
  description,
  status = 'stable',
  critical = false,
  examples = [],
  props = [],
  notes,
  seeAlso = [],
  className,
  children
}: ComponentDocProps) {
  const statusColors = {
    stable: "bg-green-500 text-white",
    beta: "bg-blue-500 text-white",
    deprecated: "bg-red-500 text-white"
  };

  return (
    <div className={cn("my-6", className)}>
      {critical && (
        <Alert variant="warning" className="mb-4 border-2 border-yellow-500">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold uppercase">DO NOT DELETE</AlertTitle>
          <AlertDescription>
            This is a critical component documentation. The implementation should not be modified without thorough understanding of its usage throughout the application.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <Badge className={cn("ml-2", statusColors[status])}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <CardDescription className="mt-2 text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          
          {examples.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-lg font-semibold">Examples</h3>
              <Accordion type="multiple" className="w-full">
                {examples.map((example, index) => (
                  <AccordionItem key={index} value={`example-${index}`}>
                    <AccordionTrigger className="text-sm font-medium">
                      {example.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      {example.description && (
                        <p className="mb-2 text-sm text-muted-foreground">{example.description}</p>
                      )}
                      <pre className="relative rounded-md bg-slate-950 p-4">
                        <Code className="absolute right-2 top-2 h-4 w-4 text-slate-400" />
                        <code className="block text-sm text-white whitespace-pre overflow-x-auto">
                          {example.code}
                        </code>
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          {props.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">Props</h3>
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr,1fr,2fr] gap-x-2 border-b bg-muted/50 p-2 font-medium">
                  <div>Name</div>
                  <div>Type</div>
                  <div>Description</div>
                </div>
                {props.map((prop, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "grid grid-cols-[1fr,1fr,2fr] gap-x-2 p-2 text-sm",
                      index % 2 === 0 ? "bg-background" : "bg-muted/30"
                    )}
                  >
                    <div className="font-mono">
                      {prop.name}
                      {prop.required ? <span className="text-red-500 ml-1">*</span> : null}
                    </div>
                    <div className="font-mono text-muted-foreground">{prop.type}</div>
                    <div>
                      {prop.description}
                      {prop.default ? (
                        <span className="text-muted-foreground ml-1">(Default: {prop.default})</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {notes && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">Notes</h3>
              <div className="rounded-md bg-muted/30 p-4 text-sm">
                <FileText className="float-right h-5 w-5 text-muted-foreground ml-2" />
                {notes}
              </div>
            </div>
          )}
          
          {seeAlso.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">See Also</h3>
              <div className="flex flex-wrap gap-2">
                {seeAlso.map((related, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {related}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ComponentDoc;
