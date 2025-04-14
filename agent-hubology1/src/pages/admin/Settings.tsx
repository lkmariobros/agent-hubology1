
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Bell, Lock, Globe, Users } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 px-[44px] py-[36px]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings for the agency portal.
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                General Configuration
              </CardTitle>
              <CardDescription>
                Basic settings for the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <input type="text" defaultValue="Property Agency" className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Support Email</label>
                  <input type="email" defaultValue="support@propertyagency.com" className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Phone</label>
                  <input type="tel" defaultValue="+1 (555) 123-4567" className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Homepage URL</label>
                  <input type="url" defaultValue="https://propertyagency.com" className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-12 text-center">Notification settings content will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and password requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-12 text-center">Security settings content will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="localization" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>
                Configure language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-12 text-center">Localization settings content will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage system users and access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-12 text-center">User management content will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
