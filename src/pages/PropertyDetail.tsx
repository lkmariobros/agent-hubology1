import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';

const AdminPropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Property Detail #{id}</h1>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-video bg-muted rounded-md mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                <div className="aspect-square bg-muted rounded-md"></div>
                <div className="aspect-square bg-muted rounded-md"></div>
                <div className="aspect-square bg-muted rounded-md"></div>
                <div className="aspect-square bg-muted rounded-md"></div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Luxury Condominium in Downtown</h2>
              <div className="flex items-center gap-2 mb-4">
                <Badge>Residential</Badge>
                <Badge variant="outline">For Sale</Badge>
                <Badge variant="secondary">Featured</Badge>
              </div>
              
              <p className="text-3xl font-bold mb-6">$750,000</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Property ID:</span>
                  <span>{id}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Address:</span>
                  <span>123 Main St, Suite 4B</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">City:</span>
                  <span>San Francisco</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">State:</span>
                  <span>CA</span>
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
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Central Air Conditioning
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    In-unit Laundry
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Hardwood Floors
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Stainless Steel Appliances
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Granite Countertops
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Walk-in Closets
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Building Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    24-hour Concierge
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Fitness Center
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Rooftop Terrace
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Package Room
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Bicycle Storage
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    Pet Friendly
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Luxurious condominium located in the heart of downtown, featuring high-end finishes throughout. 
                This 2-bedroom, 2-bathroom residence offers stunning city views, an open-concept floor plan, 
                and a chef's kitchen with top-of-the-line appliances. Building amenities include 24-hour concierge, 
                fitness center, and a rooftop terrace with panoramic views.
              </p>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold mb-2">Agent Notes</h3>
                <p className="text-muted-foreground">
                  Property has received multiple inquiries. Owner is motivated to sell and may consider offers 
                  slightly below asking price. Building has an upcoming assessment for facade work that should 
                  be disclosed to potential buyers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-full bg-green-500 rounded-full"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Listed for Sale</h3>
                      <Badge variant="outline">Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Mar 1, 2023</p>
                    <p className="text-sm">Price: $750,000</p>
                    <p className="text-sm">Agent: John Doe</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-1 h-full bg-muted rounded-full"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Previous Transaction</h3>
                    <p className="text-sm text-muted-foreground mb-1">Jun 15, 2018</p>
                    <p className="text-sm">Price: $620,000</p>
                    <p className="text-sm">Type: Purchase</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-1 h-full bg-muted rounded-full"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Original Sale</h3>
                    <p className="text-sm text-muted-foreground mb-1">Feb 10, 2010</p>
                    <p className="text-sm">Price: $450,000</p>
                    <p className="text-sm">Type: New Construction</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Property Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>Floor Plan.pdf</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Uploaded on Mar 1, 2023</span>
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </li>
                <li className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>Property Disclosure.pdf</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Uploaded on Mar 1, 2023</span>
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </li>
                <li className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>HOA Documents.pdf</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Uploaded on Mar 1, 2023</span>
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </li>
                <li className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>Title Report.pdf</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Uploaded on Mar 2, 2023</span>
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">Price reduced from $775,000 to $750,000</p>
                    <p className="text-sm text-muted-foreground">Mar 15, 2023 by Admin User</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium">Property set as Featured</p>
                    <p className="text-sm text-muted-foreground">Mar 10, 2023 by Admin User</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">New photos added (5)</p>
                    <p className="text-sm text-muted-foreground">Mar 5, 2023 by John Doe</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="font-medium">Property description updated</p>
                    <p className="text-sm text-muted-foreground">Mar 3, 2023 by John Doe</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium">Property created</p>
                    <p className="text-sm text-muted-foreground">Mar 1, 2023 by John Doe</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {property.features && Array.isArray(property.features) && property.features.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <ul className="grid grid-cols-2 gap-2">
            {property.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyDetail;
