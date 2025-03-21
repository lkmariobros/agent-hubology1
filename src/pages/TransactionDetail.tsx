
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Transaction #{id}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="property">Property</TabsTrigger>
                <TabsTrigger value="commission">Commission</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Transaction Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <span>{id}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Type:</span>
                        <span>Sale</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium text-green-600">Completed</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Date:</span>
                        <span>Mar 15, 2023</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Agent:</span>
                        <span>John Doe</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Client Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Name:</span>
                        <span>Sarah Johnson</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span>sarah@example.com</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Notes</h3>
                  <p className="text-muted-foreground">
                    Client was very satisfied with the service. Looking to invest in additional properties next year.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="property">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Property Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Address:</span>
                          <span>123 Main St, Suite 4B</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">City:</span>
                          <span>San Francisco</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">State/Province:</span>
                          <span>CA</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Postal Code:</span>
                          <span>94103</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Country:</span>
                          <span>USA</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Property Type:</span>
                          <span>Condominium</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Price:</span>
                          <span>$750,000</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Size:</span>
                          <span>1,200 sqft</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Bedrooms:</span>
                          <span>2</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Bathrooms:</span>
                          <span>2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="commission">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Commission Details</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Total Commission:</span>
                          <span className="font-medium">$22,500</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Agent Tier:</span>
                          <span>Senior (85%)</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Agent Commission:</span>
                          <span className="font-medium text-green-600">$19,125</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Agency Commission:</span>
                          <span>$3,375</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium text-amber-600">Pending Approval</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Co-Broking Information</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Co-Broking:</span>
                          <span>Yes</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Partner Agency:</span>
                          <span>City Realty Group</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Partner Agent:</span>
                          <span>Michael Wong</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Split Ratio:</span>
                          <span>50/50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Transaction Documents</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span>Purchase Agreement.pdf</span>
                      <span className="text-sm text-muted-foreground">Uploaded on Mar 10, 2023</span>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span>Property Disclosure.pdf</span>
                      <span className="text-sm text-muted-foreground">Uploaded on Mar 12, 2023</span>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span>Closing Statement.pdf</span>
                      <span className="text-sm text-muted-foreground">Uploaded on Mar 15, 2023</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TransactionDetail;
