
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import InviteAgentDialog from './InviteAgentDialog';
import { useInvitations } from '@/hooks/useInvitations';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface InvitationsManagementProps {
  agentId?: string;
  isAdmin?: boolean;
}

const InvitationsManagement: React.FC<InvitationsManagementProps> = ({ 
  agentId,
  isAdmin = false 
}) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { invitations, resendInvitation, cancelInvitation } = useInvitations(agentId);
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'accepted':
        // Changed from 'success' to 'default' as 'success' is not a valid variant
        return 'default';
      case 'expired':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Invitations</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setInviteDialogOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Agent
        </Button>
      </CardHeader>
      <CardContent>
        {invitations && invitations.length > 0 ? (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div 
                key={invitation.id} 
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div>
                  <div className="font-medium">
                    {invitation.first_name} {invitation.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {invitation.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusBadgeVariant(invitation.status)}>
                      {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Sent: {format(new Date(invitation.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invitation.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => resendInvitation(invitation.id)}
                      >
                        Resend
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => cancelInvitation(invitation.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No invitations have been sent yet.
          </div>
        )}
      </CardContent>
      
      <InviteAgentDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        uplineId={agentId}
      />
    </Card>
  );
};

export default InvitationsManagement;
