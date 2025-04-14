
import React from 'react';
import { ComponentDoc } from '../ComponentDoc';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, Terminal, Check } from 'lucide-react';

export function AlertDoc() {
  return (
    <ComponentDoc
      title="Alert Component"
      description="Displays a callout for user attention with different severity levels."
      status="stable"
      critical={true}
      examples={[
        {
          title: "Default Alert",
          code: `<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>This is a standard informational alert.</AlertDescription>
</Alert>`,
        },
        {
          title: "Destructive Alert",
          code: `<Alert variant="destructive">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
</Alert>`,
        },
        {
          title: "Warning Alert",
          code: `<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>There are unsaved changes that may be lost.</AlertDescription>
</Alert>`,
        }
      ]}
      props={[
        {
          name: "variant",
          type: '"default" | "destructive" | "warning"',
          required: false,
          default: "default",
          description: "Controls the visual style of the alert"
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Additional CSS classes to apply to the alert"
        }
      ]}
      notes="The Alert component supports multiple variants for different use cases. Use 'default' for general information, 'destructive' for errors, and 'warning' for cautionary messages."
      seeAlso={["Toast", "Dialog", "ErrorBoundary"]}
    >
      <div className="space-y-4 my-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>This is an example of the default alert style.</AlertDescription>
        </Alert>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>This is an example of the destructive alert style.</AlertDescription>
        </Alert>
        
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>This is an example of the warning alert style.</AlertDescription>
        </Alert>
      </div>
    </ComponentDoc>
  );
}

export default AlertDoc;
