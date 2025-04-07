
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SaveIcon } from 'lucide-react';

const PropertyPreferences = () => {
  const [displayPreferences, setDisplayPreferences] = useState({
    showPriceAlways: true,
    defaultView: 'grid',
    enableQuickActions: true,
    showFeaturedFirst: true,
    autoRefreshInterval: '15'
  });

  const handleSwitchChange = (field: string) => {
    setDisplayPreferences(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setDisplayPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savePreferences = () => {
    // In a real implementation, this would save to backend
    console.log('Saving preferences:', displayPreferences);
    toast.success('Display preferences saved successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Display Preferences</CardTitle>
        <CardDescription>
          Customize how properties are displayed throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showPriceAlways">Always Show Property Price</Label>
            <p className="text-sm text-muted-foreground">
              Display property prices on all views including summaries
            </p>
          </div>
          <Switch 
            id="showPriceAlways" 
            checked={displayPreferences.showPriceAlways}
            onCheckedChange={() => handleSwitchChange('showPriceAlways')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showFeaturedFirst">Show Featured Properties First</Label>
            <p className="text-sm text-muted-foreground">
              Prioritize featured properties in all property listings
            </p>
          </div>
          <Switch 
            id="showFeaturedFirst" 
            checked={displayPreferences.showFeaturedFirst}
            onCheckedChange={() => handleSwitchChange('showFeaturedFirst')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableQuickActions">Enable Quick Actions</Label>
            <p className="text-sm text-muted-foreground">
              Show quick action buttons on property cards
            </p>
          </div>
          <Switch 
            id="enableQuickActions" 
            checked={displayPreferences.enableQuickActions}
            onCheckedChange={() => handleSwitchChange('enableQuickActions')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="defaultView">Default Property View</Label>
            <p className="text-sm text-muted-foreground">
              Choose the default view for property listings
            </p>
          </div>
          <Select 
            value={displayPreferences.defaultView}
            onValueChange={(value) => handleSelectChange('defaultView', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="map">Map View</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoRefreshInterval">Auto-refresh Interval</Label>
            <p className="text-sm text-muted-foreground">
              How often property listings should refresh
            </p>
          </div>
          <Select 
            value={displayPreferences.autoRefreshInterval}
            onValueChange={(value) => handleSelectChange('autoRefreshInterval', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Never</SelectItem>
              <SelectItem value="5">Every 5 minutes</SelectItem>
              <SelectItem value="15">Every 15 minutes</SelectItem>
              <SelectItem value="30">Every 30 minutes</SelectItem>
              <SelectItem value="60">Every hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full" onClick={savePreferences}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyPreferences;
