import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, User, Lock, BellRing, Globe, Briefcase, Warehouse } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(8, {
    message: "Phone number must be at least 8 characters.",
  }),
  renNumber: z.string().min(1, {
    message: "REN Number is required for registered agents.",
  }),
  agencyName: z.string().min(1, {
    message: "Agency name is required.",
  }),
  agencyAddress: z.string().min(1, {
    message: "Agency address is required.",
  })
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Settings() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const defaultValues: Partial<ProfileFormValues> = {
    name: "James Brown",
    email: "james@propertypro.com",
    phone: "+60 12-345-6789",
    renNumber: "REN 12345",
    agencyName: "PropertyPro Real Estate",
    agencyAddress: "123 Main Street, 50450 Kuala Lumpur, Malaysia"
  };
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    setIsEditing(false);
    console.log(data);
    // Here you would typically save to backend
  }

  const toggleEdit = () => {
    if (isEditing) {
      form.reset(defaultValues);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="container max-w-6xl pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and agency settings</p>
        </div>
        
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleEdit}>
              Discard
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Card className="w-full lg:w-64 h-fit sticky top-6">
          <CardContent className="p-0">
            <nav className="flex flex-col">
              <Button variant="ghost" className="justify-start h-12 px-4 gap-2 font-normal rounded-none">
                <User className="h-4 w-4" />
                Account Settings
              </Button>
              <Button variant="ghost" className="justify-start h-12 px-4 gap-2 font-normal rounded-none">
                <Lock className="h-4 w-4" />
                Privacy & Security
              </Button>
              <Button variant="ghost" className="justify-start h-12 px-4 gap-2 font-normal rounded-none">
                <BellRing className="h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="justify-start h-12 px-4 gap-2 font-normal rounded-none">
                <Globe className="h-4 w-4" />
                Language & Region
              </Button>
              
              <Separator className="my-2" />
              <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">AGENCY SETTINGS</div>
              
              <Button variant="ghost" className="justify-start h-12 px-4 gap-2 font-normal rounded-none">
                <Briefcase className="h-4 w-4" />
                Agent Profile
              </Button>
              <Button variant="ghost" className="justify-start h-12 px-4 gap-2 font-normal rounded-none">
                <Warehouse className="h-4 w-4" />
                Agency Details
              </Button>
            </nav>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="agency">Agency</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                      {/* Profile Photo */}
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="/placeholder.svg" alt="Profile" />
                          <AvatarFallback>JB</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      {/* Personal Info */}
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between">
                                  <FormLabel>Full Name</FormLabel>
                                  {!isEditing && (
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={toggleEdit}
                                      className="h-5 w-5"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {isEditing ? (
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  ) : (
                                    <div className="py-2">{field.value}</div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="renNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>REN Number</FormLabel>
                                  <FormDescription>
                                    Your Malaysian Estate Agent registration number
                                  </FormDescription>
                                  {isEditing ? (
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  ) : (
                                    <div className="py-2">{field.value}</div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormDescription>
                                    Business email recommended
                                  </FormDescription>
                                  {isEditing ? (
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  ) : (
                                    <div className="py-2">{field.value}</div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormDescription>
                                    Business phone number recommended
                                  </FormDescription>
                                  {isEditing ? (
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  ) : (
                                    <div className="py-2">{field.value}</div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="agency">
                <Card>
                  <CardHeader>
                    <CardTitle>Agency Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="agencyName"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between">
                                  <FormLabel>Agency Name</FormLabel>
                                  {!isEditing && (
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={toggleEdit}
                                      className="h-5 w-5"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                {isEditing ? (
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                ) : (
                                  <div className="py-2">{field.value}</div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="agencyAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agency Address</FormLabel>
                                {isEditing ? (
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                ) : (
                                  <div className="py-2">{field.value}</div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive email about new listings and transactions
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive text messages for urgent updates
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Commission Alerts</h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you receive commission payments
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
