
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyDetails from './PropertyDetails';
import PropertyOwnerCard from './PropertyOwnerCard';
import TeamNotesSection from './TeamNotes';
import { TeamNote } from './TeamNotes';
import { supabase } from '@/lib/supabase';

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
  const [features, setFeatures] = useState<any[]>([]);
  const [currentOwner, setCurrentOwner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch property features
  useEffect(() => {
    const fetchPropertyFeatures = async () => {
      if (!property?.id) return;
      
      console.log('PropertyTabsSection: Property', property);
      
      try {
        // Check if the table exists first
        const { error: tableCheckError } = await supabase
          .from('property_features')
          .select('id')
          .limit(1);
          
        if (tableCheckError) {
          console.error('Error checking property_features table:', tableCheckError);
          return; // Table doesn't exist yet
        }
        
        const { data, error } = await supabase
          .from('property_features')
          .select('*')
          .eq('property_id', property.id);
          
        if (error) throw error;
        
        console.log('PropertyTabsSection: Features', data || []);
        setFeatures(data || []);
      } catch (err) {
        console.error('Error fetching property features:', err);
      }
    };
    
    const fetchPropertyOwner = async () => {
      if (!property?.id) return;
      
      try {
        // Check if the table exists first
        const { error: tableCheckError } = await supabase
          .from('property_owners')
          .select('id')
          .limit(1);
          
        if (tableCheckError) {
          console.error('Error checking property_owners table:', tableCheckError);
          return; // Table doesn't exist yet
        }
        
        const { data, error } = await supabase
          .from('property_owners')
          .select('*')
          .eq('property_id', property.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned"
        
        console.log('PropertyTabsSection: Owner', data || null);
        setCurrentOwner(data || owner);
      } catch (err) {
        console.error('Error fetching property owner:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    setIsLoading(true);
    console.log('PropertyTabsSection: Owner', owner);
    console.log('PropertyTabsSection: Features', features);
    
    fetchPropertyFeatures();
    fetchPropertyOwner();
  }, [property?.id, owner]);
  
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="owner">Owner</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4">
        <PropertyDetails property={property} features={features} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="owner">
        {currentOwner ? (
          <PropertyOwnerCard owner={currentOwner} isLoading={isLoading} />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No owner information available
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="transactions">
        <div className="text-center text-muted-foreground py-8">
          No transaction history available
        </div>
      </TabsContent>
      
      <TabsContent value="documents">
        <div className="text-center text-muted-foreground py-8">
          No documents available
        </div>
      </TabsContent>
      
      <TabsContent value="history">
        <div className="text-center text-muted-foreground py-8">
          No history available
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabsSection;
