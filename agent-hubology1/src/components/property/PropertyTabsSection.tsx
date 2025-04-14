
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyDetails from './PropertyDetails';
import PropertyOwnerInfo from './PropertyOwnerInfo';
import { TeamNotes, TeamNote } from './TeamNotes';

interface PropertyTabsSectionProps {
  property: any;
  owner: any;
  notes: TeamNote[];
  onAddNote: (note: Omit<TeamNote, 'id' | 'date'>) => void;
}

const PropertyTabsSection: React.FC<PropertyTabsSectionProps> = ({ 
  property,
  owner,
  notes, 
  onAddNote 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tabs section - takes 2/3 of the space */}
      <div className="md:col-span-2">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="owner">Owner</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <PropertyDetails property={property} />
          </TabsContent>
          
          <TabsContent value="owner">
            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto md:mx-0">
                  <PropertyOwnerInfo owner={owner} />
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
                <div className="text-center text-muted-foreground py-4">
                  No transaction history available for this property
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
                <div className="text-center text-muted-foreground py-4">
                  No documents available for this property
                </div>
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
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium">Property created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(property.created_at).toLocaleDateString()} by {property.agent_id || 'System'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Team Notes section - now with more width (1/3 of the space) */}
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Team Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <TeamNotes notes={notes} onAddNote={onAddNote} className="h-full" hideTitle={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyTabsSection;
