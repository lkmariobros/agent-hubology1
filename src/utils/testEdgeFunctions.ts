
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Tests all Edge Functions related to the commission approval system
 * to ensure they're running correctly
 */
export const testEdgeFunctions = async () => {
  const results: Record<string, { success: boolean; message: string }> = {};
  const userId = supabase.auth.getUser().then(res => res.data.user?.id);

  try {
    console.log('Starting edge function tests...');

    // Test get_approval_status_counts
    try {
      console.log('Testing get_approval_status_counts...');
      const { data, error } = await supabase.functions.invoke('get_approval_status_counts');
      
      if (error) throw error;
      
      console.log('get_approval_status_counts result:', data);
      results['get_approval_status_counts'] = { 
        success: true, 
        message: 'Successfully fetched approval status counts' 
      };
    } catch (error: any) {
      console.error('Error testing get_approval_status_counts:', error);
      results['get_approval_status_counts'] = { 
        success: false, 
        message: `Error: ${error.message || 'Unknown error'}` 
      };
    }

    // Test get_approved_commission_total
    try {
      console.log('Testing get_approved_commission_total...');
      const { data, error } = await supabase.functions.invoke('get_approved_commission_total');
      
      if (error) throw error;
      
      console.log('get_approved_commission_total result:', data);
      results['get_approved_commission_total'] = { 
        success: true, 
        message: `Successfully fetched approved commission total: ${(data as any).total}` 
      };
    } catch (error: any) {
      console.error('Error testing get_approved_commission_total:', error);
      results['get_approved_commission_total'] = { 
        success: false, 
        message: `Error: ${error.message || 'Unknown error'}` 
      };
    }

    // Test get_pending_commission_total
    try {
      console.log('Testing get_pending_commission_total...');
      const { data, error } = await supabase.functions.invoke('get_pending_commission_total');
      
      if (error) throw error;
      
      console.log('get_pending_commission_total result:', data);
      results['get_pending_commission_total'] = { 
        success: true, 
        message: `Successfully fetched pending commission total: ${(data as any).total}` 
      };
    } catch (error: any) {
      console.error('Error testing get_pending_commission_total:', error);
      results['get_pending_commission_total'] = { 
        success: false, 
        message: `Error: ${error.message || 'Unknown error'}` 
      };
    }

    // Test get_commission_approvals
    try {
      console.log('Testing get_commission_approvals...');
      const { data, error } = await supabase.functions.invoke('get_commission_approvals', {
        body: {
          p_status: null,
          p_user_id: null,
          p_limit: 5,
          p_offset: 0
        }
      });
      
      if (error) throw error;
      
      console.log('get_commission_approvals result:', data);
      results['get_commission_approvals'] = { 
        success: true, 
        message: `Successfully fetched approvals: ${Array.isArray(data) ? data.length : 0} records` 
      };
    } catch (error: any) {
      console.error('Error testing get_commission_approvals:', error);
      results['get_commission_approvals'] = { 
        success: false, 
        message: `Error: ${error.message || 'Unknown error'}` 
      };
    }

    // If we have any approval, test the detail functions
    const { data: approvals } = await supabase.functions.invoke('get_commission_approvals', {
      body: {
        p_status: null,
        p_user_id: null,
        p_limit: 1,
        p_offset: 0
      }
    });

    if (Array.isArray(approvals) && approvals.length > 0) {
      const testApprovalId = approvals[0].id;
      
      // Test get_commission_approval_detail
      try {
        console.log('Testing get_commission_approval_detail...');
        const { data, error } = await supabase.functions.invoke('get_commission_approval_detail', {
          body: { p_approval_id: testApprovalId }
        });
        
        if (error) throw error;
        
        console.log('get_commission_approval_detail result:', data);
        results['get_commission_approval_detail'] = { 
          success: true, 
          message: 'Successfully fetched approval detail' 
        };
      } catch (error: any) {
        console.error('Error testing get_commission_approval_detail:', error);
        results['get_commission_approval_detail'] = { 
          success: false, 
          message: `Error: ${error.message || 'Unknown error'}` 
        };
      }
      
      // Test get_commission_approval_history
      try {
        console.log('Testing get_commission_approval_history...');
        const { data, error } = await supabase.functions.invoke('get_commission_approval_history', {
          body: { p_approval_id: testApprovalId }
        });
        
        if (error) throw error;
        
        console.log('get_commission_approval_history result:', data);
        results['get_commission_approval_history'] = { 
          success: true, 
          message: `Successfully fetched approval history: ${Array.isArray(data) ? data.length : 0} records` 
        };
      } catch (error: any) {
        console.error('Error testing get_commission_approval_history:', error);
        results['get_commission_approval_history'] = { 
          success: false, 
          message: `Error: ${error.message || 'Unknown error'}` 
        };
      }
      
      // Test get_commission_approval_comments
      try {
        console.log('Testing get_commission_approval_comments...');
        const { data, error } = await supabase.functions.invoke('get_commission_approval_comments', {
          body: { p_approval_id: testApprovalId }
        });
        
        if (error) throw error;
        
        console.log('get_commission_approval_comments result:', data);
        results['get_commission_approval_comments'] = { 
          success: true, 
          message: `Successfully fetched approval comments: ${Array.isArray(data) ? data.length : 0} records` 
        };
      } catch (error: any) {
        console.error('Error testing get_commission_approval_comments:', error);
        results['get_commission_approval_comments'] = { 
          success: false, 
          message: `Error: ${error.message || 'Unknown error'}` 
        };
      }
      
      // Test add and delete comment (requires auth)
      if (await userId) {
        // Test add_commission_approval_comment
        try {
          console.log('Testing add_commission_approval_comment...');
          const { data, error } = await supabase.functions.invoke('add_commission_approval_comment', {
            body: { 
              p_approval_id: testApprovalId,
              p_content: "Test comment from edge function test utility" 
            }
          });
          
          if (error) throw error;
          
          console.log('add_commission_approval_comment result:', data);
          
          // If we successfully added a comment, try deleting it
          if (data && (data as any).comment_id) {
            try {
              console.log('Testing delete_commission_approval_comment...');
              const deleteResult = await supabase.functions.invoke('delete_commission_approval_comment', {
                body: { p_comment_id: (data as any).comment_id }
              });
              
              if (deleteResult.error) throw deleteResult.error;
              
              console.log('delete_commission_approval_comment result:', deleteResult.data);
              results['comment_operations'] = { 
                success: true, 
                message: 'Successfully added and deleted test comment' 
              };
            } catch (deleteError: any) {
              console.error('Error testing delete_commission_approval_comment:', deleteError);
              results['comment_operations'] = { 
                success: false, 
                message: `Added comment but failed to delete: ${deleteError.message || 'Unknown error'}` 
              };
            }
          } else {
            results['comment_operations'] = { 
              success: true, 
              message: 'Comment added but no comment ID returned' 
            };
          }
        } catch (error: any) {
          console.error('Error testing add_commission_approval_comment:', error);
          results['comment_operations'] = { 
            success: false, 
            message: `Error: ${error.message || 'Unknown error'}` 
          };
        }
      }
    }

    console.log('Edge function test results:', results);
    
    // Count successes and failures
    const successes = Object.values(results).filter(r => r.success).length;
    const failures = Object.values(results).filter(r => !r.success).length;
    
    // Present results
    if (failures === 0) {
      toast.success(`All ${successes} RPC calls are working correctly!`);
    } else {
      toast.error(`${failures} RPC calls failed. Check console for details.`);
    }
    
    return results;
  } catch (error: any) {
    console.error('Error in test suite:', error);
    toast.error(`Test suite error: ${error.message}`);
    return { testSuite: { success: false, message: error.message } };
  }
};
