
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Edit, Upload, Bell, Shield, Key } from 'lucide-react';

const Profile = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                
                <Button variant="outline" size="sm" className="mb-6">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-muted-foreground mb-1">Senior Agent</p>
                <Badge variant="outline" className="mb-4">Tier 5</Badge>
                
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sales Volume</span>
                    <span className="font-medium">$4.5M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Commission Earned</span>
                    <span className="font-medium">$385,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Listings</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value="John" readOnly className="bg-muted" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value="Doe" readOnly className="bg-muted" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value="john.doe@example.com" readOnly className="bg-muted" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value="+1 (555) 123-4567" readOnly className="bg-muted" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value="123 Main St, Suite 100" readOnly className="bg-muted" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value="San Francisco" readOnly className="bg-muted" />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value="CA" readOnly className="bg-muted" />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" value="94103" readOnly className="bg-muted" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="professional">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        readOnly 
                        className="bg-muted min-h-32"
                        value="Experienced real estate agent with over 10 years in the industry. Specializing in luxury properties and commercial real estate throughout the San Francisco Bay Area."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input id="licenseNumber" value="RE12345678" readOnly className="bg-muted" />
                      </div>
                      <div>
                        <Label htmlFor="licenseExpiry">License Expiry</Label>
                        <Input id="licenseExpiry" value="2025-06-30" readOnly className="bg-muted" />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">Specializations</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Luxury Properties</Badge>
                        <Badge variant="secondary">Commercial</Badge>
                        <Badge variant="secondary">Investment</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">Service Areas</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Downtown</Badge>
                        <Badge variant="outline">Westside</Badge>
                        <Badge variant="outline">North Hills</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="account">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <Key className="h-5 w-5 mr-2 text-muted-foreground" />
                          <CardTitle className="text-base">Password</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Last changed on March 15, 2023
                        </p>
                        <Button variant="outline">Change Password</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                          <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <Button>Enable 2FA</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive email updates about system activities</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive push notifications in-app</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Commission Approvals</p>
                          <p className="text-sm text-muted-foreground">Get notified when your commissions are approved</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Opportunities</p>
                          <p className="text-sm text-muted-foreground">Get notified about new opportunities</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Updates</p>
                          <p className="text-sm text-muted-foreground">Receive updates about marketing campaigns</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
