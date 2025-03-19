
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AgentWithHierarchy } from '@/types';

interface AgentNodeProps {
  agent: AgentWithHierarchy;
  isRoot?: boolean;
  onAgentClick: (agent: AgentWithHierarchy) => void;
}

const AgentNode: React.FC<AgentNodeProps> = ({ agent, isRoot = false, onAgentClick }) => {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Advisor': return 'bg-blue-500';
      case 'Sales Leader': return 'bg-purple-500';
      case 'Team Leader': return 'bg-pink-500';
      case 'Group Leader': return 'bg-orange-500';
      case 'Supreme Leader': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`flex flex-col items-center ${isRoot ? 'mb-8' : ''}`}
      onClick={() => onAgentClick(agent)}
    >
      <div className="flex flex-col items-center p-3 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-2 right-0 w-4 h-4 rounded-full ${getRankColor(agent.rank)} border-2 border-background`} />
        </div>
        <span className="font-medium text-sm truncate max-w-[120px]">{agent.name}</span>
        <Badge variant="outline" className="mt-1 text-xs">
          {agent.rank}
        </Badge>
      </div>
      
      {agent.downline && agent.downline.length > 0 && (
        <>
          <div className="w-px h-4 bg-border mt-2"></div>
          <div className="relative flex">
            <div className="absolute top-0 w-full h-4 border-l border-r border-t border-border rounded-t-lg"></div>
            <div className="pt-4 flex space-x-4 mt-2">
              {agent.downline.map((downlineAgent) => (
                <AgentNode 
                  key={downlineAgent.id} 
                  agent={downlineAgent} 
                  onAgentClick={onAgentClick} 
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface AgentHierarchyChartProps {
  data: AgentWithHierarchy;
  onAgentClick: (agent: AgentWithHierarchy) => void;
}

const AgentHierarchyChart: React.FC<AgentHierarchyChartProps> = ({ data, onAgentClick }) => {
  return (
    <Card className="w-full overflow-auto">
      <CardHeader>
        <CardTitle>Agent Hierarchy</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className="flex justify-center min-w-[800px] p-4">
          <AgentNode agent={data} isRoot onAgentClick={onAgentClick} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentHierarchyChart;
