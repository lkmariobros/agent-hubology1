
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyPreferences from '@/components/property/settings/PropertyPreferences';
import DefaultPropertyValues from '@/components/property/settings/DefaultPropertyValues';
import NotificationSettings from '@/components/property/settings/NotificationSettings';

const PropertySettings = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Property Settings</h1>
        <p className="text-muted-foreground">
          Configure your property preferences and default values
        </p>
      </div>

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="defaults">Default Values</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-4">
          <PropertyPreferences />
        </TabsContent>
        
        <TabsContent value="defaults" className="space-y-4">
          <DefaultPropertyValues />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertySettings;
