
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CutoffDateSettings from './CutoffDateSettings';
import TestEdgeFunctionButton from './TestEdgeFunctionButton';

export function CommissionSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Commission Settings</h2>
          <p className="text-muted-foreground">
            Configure global settings for commission calculations and payments
          </p>
        </div>
        <TestEdgeFunctionButton />
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
              <p className="text-sm text-muted-foreground mb-4">
                Default payment schedules can be configured in the{" "}
                <a href="/admin/commission/schedules" className="text-primary underline">
                  Payment Schedules
                </a>{" "}
                section.
              </p>
              <Button asChild variant="outline">
                <a href="/admin/commission/schedules">Manage Payment Schedules</a>
              </Button>
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
              <p className="text-sm text-muted-foreground mb-4">
                Commission rules can be configured in the{" "}
                <a href="/admin/commission/tiers" className="text-primary underline">
                  Commission Tiers
                </a>{" "}
                section.
              </p>
              <Button asChild variant="outline">
                <a href="/admin/commission/tiers">Manage Commission Tiers</a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Edge Function Tests</CardTitle>
              <CardDescription>
                Test Edge Functions that handle commission calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Edge Functions are used for commission calculations, installment generation, 
                and payment schedule processing.
              </p>
              <TestEdgeFunctionButton />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CommissionSettings;
