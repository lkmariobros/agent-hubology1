
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BellIcon, SaveIcon } from 'lucide-react';

const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    newProperties: true,
    priceChanges: true,
    statusChanges: true,
    inquiries: true,
    marketReports: false,
    emailNotifications: true,
    pushNotifications: false,
    notificationFrequency: 'immediate'
  });

  const handleSwitchChange = (field: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveNotificationSettings = () => {
    // In a real implementation, this would save to backend
    console.log('Saving notification settings:', notificationSettings);
    toast.success('Notification settings saved successfully');
  };

  const testNotification = () => {
    toast.success('This is a test notification', {
      description: 'Your notification settings are working correctly',
      icon: <BellIcon className="h-4 w-4" />,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Notification Settings</CardTitle>
        <CardDescription>
          Configure when and how you receive property-related notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Event Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newProperties">New Properties</Label>
              <p className="text-sm text-muted-foreground">
                Notify when new properties matching your criteria are added
              </p>
            </div>
            <Switch 
              id="newProperties" 
              checked={notificationSettings.newProperties}
              onCheckedChange={() => handleSwitchChange('newProperties')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="priceChanges">Price Changes</Label>
              <p className="text-sm text-muted-foreground">
                Notify when property prices are updated
              </p>
            </div>
            <Switch 
              id="priceChanges" 
              checked={notificationSettings.priceChanges}
              onCheckedChange={() => handleSwitchChange('priceChanges')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="statusChanges">Status Changes</Label>
              <p className="text-sm text-muted-foreground">
                Notify when property status changes (e.g., sold, pending)
              </p>
            </div>
            <Switch 
              id="statusChanges" 
              checked={notificationSettings.statusChanges}
              onCheckedChange={() => handleSwitchChange('statusChanges')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="inquiries">Property Inquiries</Label>
              <p className="text-sm text-muted-foreground">
                Notify when clients make inquiries about your listed properties
              </p>
            </div>
            <Switch 
              id="inquiries" 
              checked={notificationSettings.inquiries}
              onCheckedChange={() => handleSwitchChange('inquiries')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketReports">Market Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly market analysis and reports
              </p>
            </div>
            <Switch 
              id="marketReports" 
              checked={notificationSettings.marketReports}
              onCheckedChange={() => handleSwitchChange('marketReports')}
            />
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Delivery Methods</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch 
              id="emailNotifications" 
              checked={notificationSettings.emailNotifications}
              onCheckedChange={() => handleSwitchChange('emailNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser or mobile device
              </p>
            </div>
            <Switch 
              id="pushNotifications" 
              checked={notificationSettings.pushNotifications}
              onCheckedChange={() => handleSwitchChange('pushNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notificationFrequency">Notification Frequency</Label>
              <p className="text-sm text-muted-foreground">
                How often you want to receive grouped notifications
              </p>
            </div>
            <Select 
              value={notificationSettings.notificationFrequency}
              onValueChange={(value) => handleSelectChange('notificationFrequency', value)}
            >
              <SelectTrigger className="w-[180px]" id="notificationFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button variant="outline" className="sm:flex-1" onClick={testNotification}>
            <BellIcon className="h-4 w-4 mr-2" />
            Test Notification
          </Button>
          <Button className="sm:flex-1" onClick={saveNotificationSettings}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
