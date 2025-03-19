
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AgentWithHierarchy } from '@/types';
import AgentHierarchyChart from './AgentHierarchyChart';
import AgentDetails from './AgentDetails';
import CommissionCalculator from './CommissionCalculator';

interface TeamContentProps {
  agentHierarchy: AgentWithHierarchy;
  selectedAgent: AgentWithHierarchy | null;
  onAgentClick: (agent: AgentWithHierarchy) => void;
  isLoading: boolean;
}

const TeamContent: React.FC<TeamContentProps> = ({
  agentHierarchy,
  selectedAgent,
  onAgentClick,
  isLoading
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
          <AgentHierarchyChart
            data={agentHierarchy}
            onAgentClick={onAgentClick}
          />
          
          {selectedAgent && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AgentDetails agent={selectedAgent} />
              
              <CommissionCalculator
                agent={selectedAgent}
                commissionRate={25}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamContent;
