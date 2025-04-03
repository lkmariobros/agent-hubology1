
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface InvitationData {
  email: string;
  firstName: string;
  lastName: string;
  uplineId?: string;
}

export function useInviteAgent() {
  const [isLoading, setIsLoading] = useState(false);

  const sendInvitation = async (invitationData: InvitationData) => {
    setIsLoading(true);
    
    try {
      // Generate a unique invitation code
      const invitationCode = uuidv4().substring(0, 8).toUpperCase();
      
      // Insert the invitation record
      const { data, error } = await supabase
        .from('agent_invitations')
        .insert({
          email: invitationData.email,
          first_name: invitationData.firstName,
          last_name: invitationData.lastName,
          upline_id: invitationData.uplineId,
          invitation_code: invitationCode,
          status: 'pending'
        })
        .select();
        
      if (error) throw error;
      
      // Call the edge function to send the invitation email
      const response = await fetch('/api/send-agent-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: invitationData.email,
          firstName: invitationData.firstName,
          invitationCode: invitationCode
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send invitation email');
      }
      
      return data;
    } catch (error) {
      console.error('Error in sendInvitation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { sendInvitation, isLoading };
}
