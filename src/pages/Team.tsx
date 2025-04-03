
import React from 'react';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import TeamContent from '@/components/team/TeamContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Team = () => {
  const {
    teamHierarchy,
    teamMetrics,
    selectedAgent,
    isLoadingHierarchy,
    isLoadingMetrics,
    handleAgentSelect,
    hierarchyError,
    isAdmin
  } = useTeamManagement();

  if (hierarchyError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load team data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>
      
      {isLoadingHierarchy ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      ) : teamHierarchy ? (
        <TeamContent
          agentHierarchy={teamHierarchy}
          selectedAgent={selectedAgent}
          onAgentClick={handleAgentSelect}
          isLoading={isLoadingHierarchy}
          teamMetrics={teamMetrics}
          isLoadingMetrics={isLoadingMetrics}
          isAdmin={isAdmin}
        />
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No team data available</AlertTitle>
          <AlertDescription>
            You are not associated with any team structure. Please contact your administrator.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Team;
