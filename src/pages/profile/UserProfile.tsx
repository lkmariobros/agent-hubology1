import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, activeRole, switchRole } = useClerkAuth();
  const { 
    profile, 
    loading, 
    updateProfile, 
    updateAgentDetails, 
    updatePreferences,
    getAgentLevelInfo
  } = useProfile();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [darkMode, setDarkMode] = useState(profile?.preferences?.dark_mode ?? true);
  const [emailNotifications, setEmailNotifications] = useState(profile?.preferences?.email_notifications ?? true);
  const [preferredPortal, setPreferredPortal] = useState(profile?.preferences?.preferred_portal || 'agent');
  const [salesTarget, setSalesTarget] = useState(profile?.agent_details?.sales_target || 0);
  
  // Load profile data into form when available
  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.profile.first_name || '');
      setLastName(profile.profile.last_name || '');
      
      if (profile.preferences) {
        setDarkMode(profile.preferences.dark_mode);
        setEmailNotifications(profile.preferences.email_notifications);
        setPreferredPortal(profile.preferences.preferred_portal);
      }
      
      if (profile.agent_details) {
        setSalesTarget(profile.agent_details.sales_target);
      }
    }
  }, [profile]);
  
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      // Update basic profile information
      const success = await updateProfile({
        firstName,
        lastName
      });
      
      if (success) {
        // Update preferences
        await updatePreferences({
          darkMode,
          emailNotifications,
          preferredPortal
        });
        
        // Update agent details if this is an agent
        if (activeRole === 'agent' && profile?.agent_details) {
          await updateAgentDetails(
            profile.agent_details.level,
            salesTarget
          );
        }
        
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Get agent level info
  const agentInfo = getAgentLevelInfo();
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">
                    {profile?.profile.first_name} {profile?.profile.last_name}
                  </CardTitle>
                  <CardDescription>{profile?.profile.email}</CardDescription>
                </div>
                <Badge variant={activeRole === 'admin' ? 'destructive' : 'default'} className="text-sm py-1">
                  {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            {activeRole === 'agent' && agentInfo && (
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Level: {agentInfo.level.charAt(0).toUpperCase() + agentInfo.level.slice(1)}</span>
                    <span>{agentInfo.progress}% to next level</span>
                  </div>
                  <Progress value={agentInfo.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {agentInfo.totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} / {agentInfo.nextLevelTarget.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            {activeRole === 'agent' && <TabsTrigger value="agent">Agent Details</TabsTrigger>}
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.profile.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email is managed by your authentication provider
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.profile && ['agent', 'admin'].map((role) => (
                      <Badge 
                        key={role}
                        variant={activeRole === role ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => switchRole(role as any)}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {activeRole === 'agent' && (
            <TabsContent value="agent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Details</CardTitle>
                  <CardDescription>
                    Update your agent-specific information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Current Level</Label>
                    <Input
                      id="level"
                      value={profile?.agent_details?.level || 'junior'}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Your level is determined by your sales performance
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salesTarget">Annual Sales Target ($)</Label>
                    <Input
                      id="salesTarget"
                      type="number"
                      value={salesTarget}
                      onChange={(e) => setSalesTarget(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Level Progress</Label>
                    {agentInfo && (
                      <>
                        <Progress value={agentInfo.progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Current: {agentInfo.totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
                          <span>Next Level: {agentInfo.nextLevelTarget.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          <TabsContent value="preferences" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the interface
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="preferredPortal">Default Portal</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={preferredPortal === 'agent' ? 'default' : 'outline'}
                      onClick={() => setPreferredPortal('agent')}
                    >
                      Agent Portal
                    </Button>
                    {(activeRole === 'admin') && (
                      <Button
                        type="button"
                        variant={preferredPortal === 'admin' ? 'default' : 'outline'}
                        onClick={() => setPreferredPortal('admin')}
                      >
                        Admin Portal
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose which portal to show by default when you log in
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleUpdateProfile} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;