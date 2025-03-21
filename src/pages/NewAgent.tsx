import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const agentFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  
  // Professional Information
  role: z.string(),
  tier: z.string(),
  bio: z.string().optional(),
  startDate: z.string(),
  
  // Specializations & Areas
  specializations: z.array(z.string()).optional(),
  serviceAreas: z.array(z.string()).optional(),
  
  // Credentials
  licenseNumber: z.string().min(5, { message: 'License number must be at least 5 characters.' }),
  licensingAuthority: z.string(),
  licenseExpiryDate: z.string(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

const NewAgent = () => {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'agent',
      tier: 'tier1',
      bio: '',
      startDate: new Date().toISOString().split('T')[0],
      specializations: [],
      serviceAreas: [],
      licenseNumber: '',
      licensingAuthority: '',
      licenseExpiryDate: '',
    },
  });

  const onSubmit = (data: AgentFormValues) => {
    console.log(data);
    toast.success('Agent created successfully');
    // Here you would normally submit the data to your backend
  };

  const specializations = [
    { id: 'luxury', label: 'Luxury Properties' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'residential', label: 'Residential' },
    { id: 'investment', label: 'Investment' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'land', label: 'Land' },
  ];

  const serviceAreas = [
    { id: 'downtown', label: 'Downtown' },
    { id: 'westside', label: 'Westside' },
    { id: 'eastside', label: 'Eastside' },
    { id: 'northHills', label: 'North Hills' },
    { id: 'southBay', label: 'South Bay' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Agent</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="personal" className="mb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="professional">Professional Information</TabsTrigger>
              <TabsTrigger value="specializations">Specializations & Areas</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Enter the agent's personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Enter the agent's professional details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="agent">Agent</SelectItem>
                              <SelectItem value="juniorAgent">Junior Agent</SelectItem>
                              <SelectItem value="seniorAgent">Senior Agent</SelectItem>
                              <SelectItem value="teamLeader">Team Leader</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tier</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tier1">Tier 1 (70%)</SelectItem>
                              <SelectItem value="tier2">Tier 2 (75%)</SelectItem>
                              <SelectItem value="tier3">Tier 3 (80%)</SelectItem>
                              <SelectItem value="tier4">Tier 4 (82.5%)</SelectItem>
                              <SelectItem value="tier5">Tier 5 (85%)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter agent bio and professional experience..."
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specializations">
              <Card>
                <CardHeader>
                  <CardTitle>Specializations & Service Areas</CardTitle>
                  <CardDescription>Select the agent's specializations and service areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <FormLabel className="block mb-3">Specializations</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {specializations.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`specialization-${item.id}`} 
                            value={item.id}
                            onCheckedChange={(checked) => {
                              const current = form.getValues().specializations || [];
                              if (checked) {
                                form.setValue('specializations', [...current, item.id]);
                              } else {
                                form.setValue('specializations', current.filter(val => val !== item.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={`specialization-${item.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel className="block mb-3">Service Areas</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {serviceAreas.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`area-${item.id}`} 
                            value={item.id}
                            onCheckedChange={(checked) => {
                              const current = form.getValues().serviceAreas || [];
                              if (checked) {
                                form.setValue('serviceAreas', [...current, item.id]);
                              } else {
                                form.setValue('serviceAreas', current.filter(val => val !== item.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={`area-${item.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="credentials">
                <Card>
                  <CardHeader>
                    <CardTitle>Credentials</CardTitle>
                    <CardDescription>Enter the agent's licensing information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="RE12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="licensingAuthority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Licensing Authority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select authority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ca_dre">California DRE</SelectItem>
                                <SelectItem value="ny_dos">New York DOS</SelectItem>
                                <SelectItem value="tx_trec">Texas TREC</SelectItem>
                                <SelectItem value="fl_dbpr">Florida DBPR</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="licenseExpiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Expiry Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Create Agent</Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
};

export default NewAgent;
