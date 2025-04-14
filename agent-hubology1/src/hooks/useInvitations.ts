
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  upline_id: string;
  invitation_code: string;
  status: string;
  created_at: string;
  expires_at: string;
}

export function useInvitations(agentId?: string) {
  const queryClient = useQueryClient();
  
  // Fetch invitations sent by this agent
  const { data: invitations } = useQuery({
    queryKey: ['invitations', agentId],
    queryFn: async () => {
      let query = supabase
        .from('agent_invitations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (agentId) {
        query = query.eq('upline_id', agentId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Invitation[];
    },
    enabled: !!agentId
  });
  
  // Resend invitation
  const resendInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data, error } = await supabase
        .rpc('resend_agent_invitation', { p_invitation_id: invitationId });
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Invitation resent successfully');
      queryClient.invalidateQueries({ queryKey: ['invitations', agentId] });
    },
    onError: (error) => {
      console.error('Failed to resend invitation:', error);
      toast.error('Failed to resend invitation');
    }
  });
  
  // Cancel invitation
  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data, error } = await supabase
        .from('agent_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Invitation cancelled');
      queryClient.invalidateQueries({ queryKey: ['invitations', agentId] });
    },
    onError: (error) => {
      console.error('Failed to cancel invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  });
  
  return {
    invitations,
    resendInvitation: resendInvitation.mutate,
    cancelInvitation: cancelInvitation.mutate
  };
}
