
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AgentWithHierarchy } from '@/types';
import AgentHierarchyChart from './AgentHierarchyChart';
import AgentDetails from './AgentDetails';
import TeamMetrics from './TeamMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitationsManagement from './InvitationsManagement';

interface TeamContentProps {
  agentHierarchy: AgentWithHierarchy;
  selectedAgent: AgentWithHierarchy | null;
  onAgentClick: (agent: AgentWithHierarchy) => void;
  isLoading: boolean;
  teamMetrics?: any;
  isLoadingMetrics?: boolean;
  isAdmin?: boolean;
}

const TeamContent: React.FC<TeamContentProps> = ({
  agentHierarchy,
  selectedAgent,
  onAgentClick,
  isLoading,
  teamMetrics,
  isLoadingMetrics = false,
  isAdmin = false
}) => {
  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <p>Loading team hierarchy...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="hierarchy">
            <TabsList className="mb-6">
              <TabsTrigger value="hierarchy">Team Structure</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hierarchy" className="space-y-6">
              <AgentHierarchyChart
                data={agentHierarchy}
                onAgentClick={onAgentClick}
                isAdmin={isAdmin}
              />
              
              {selectedAgent && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AgentDetails agent={selectedAgent} isAdmin={isAdmin} />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="performance">
              <TeamMetrics 
                teamMetrics={teamMetrics} 
                selectedAgent={selectedAgent}
                isLoading={isLoadingMetrics} 
              />
            </TabsContent>
            
            <TabsContent value="invitations">
              <InvitationsManagement 
                agentId={agentHierarchy.id}
                isAdmin={isAdmin}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default TeamContent;
