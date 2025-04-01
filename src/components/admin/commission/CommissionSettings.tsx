
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CutoffDateSettings from './CutoffDateSettings';

export function CommissionSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Commission Settings</h2>
        <p className="text-muted-foreground">
          Configure global settings for commission calculations and payments
        </p>
      </div>
      
      <Tabs defaultValue="payment">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payment">Payment Settings</TabsTrigger>
          <TabsTrigger value="calculation">Calculation Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment" className="space-y-6 pt-4">
          <CutoffDateSettings />
          
          <Card>
            <CardHeader>
              <CardTitle>Default Payment Schedule</CardTitle>
              <CardDescription>
                Configure the default payment schedule applied to new commissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Default payment schedules can be configured in the{" "}
                <a href="/admin/commission/schedules" className="text-primary underline">
                  Payment Schedules
                </a>{" "}
                section.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculation" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Calculation Rules</CardTitle>
              <CardDescription>
                Configure rules for automatic commission calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Commission rules can be configured in the{" "}
                <a href="/admin/commission/tiers" className="text-primary underline">
                  Commission Tiers
                </a>{" "}
                section.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CommissionSettings;
