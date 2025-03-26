
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSendNotification } from '@/hooks/useSendNotification';
import { useAuth } from "@/hooks/useAuth";
import { NotificationType } from '@/types/notification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

const NotificationDebugger: React.FC = () => {
  const { user } = useAuth();
  const { mutate: sendNotification } = useSendNotification();
  const [logs, setLogs] = useState<string[]>([]);
  const [functionLogs, setFunctionLogs] = useState<string[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  const fetchEdgeFunctionLogs = async () => {
    if (!user) return;
    
    setIsLoadingLogs(true);
    try {
      addLog(`Fetching logs for create_notification edge function...`);
      
      // This would ideally call a dedicated admin function to fetch logs
      // For now we'll simulate with a placeholder
      setFunctionLogs([
        '[Edge Function] Logs would appear here if we had proper access',
        '[Edge Function] In production, implement a secure method to fetch logs'
      ]);
      
      addLog(`Successfully fetched edge function logs`);
    } catch (error: any) {
      addLog(`❌ Error fetching logs: ${error.message}`);
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  const sendTestNotification = async (type: NotificationType, title: string, data: any) => {
    if (!user?.id) {
      addLog("❌ Error: No user ID found");
      return;
    }
    
    try {
      addLog(`📤 Sending notification of type: ${type}`);
      addLog(`📦 Data: ${JSON.stringify(data)}`);
      
      sendNotification({
        userId: user.id,
        type,
        title,
        message: `Test message for ${type}`,
        data
      }, {
        onSuccess: (response) => {
          addLog(`✅ Success: ${JSON.stringify(response)}`);
        },
        onError: (error) => {
          addLog(`❌ Error: ${error.message}`);
        }
      });
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Notification Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="send">
          <TabsList className="mb-4">
            <TabsTrigger value="send">Send Notifications</TabsTrigger>
            <TabsTrigger value="logs">Debug Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => 
                sendTestNotification(
                  'approval_status_change', 
                  'Approval Test',
                  {
                    notificationType: 'approval_approved',
                    commissionAmount: 10000,
                    transactionId: `tx-${Date.now()}`,
                    approvalId: `ap-${Date.now()}`
                  }
                )
              }>
                Test Approval
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => 
                sendTestNotification(
                  'tier_update', 
                  'Tier Progress', 
                  {
                    notificationType: 'tier_progress',
                    progressPercentage: 75
                  }
                )
              }>
                Test Tier Progress
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => 
                sendTestNotification(
                  'tier_update', 
                  'Tier Achieved',
                  {
                    notificationType: 'tier_achieved',
                    tierName: 'Gold'
                  }
                )
              }>
                Test Tier Achievement
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => 
                sendTestNotification(
                  'commission_milestone', 
                  'Milestone Reached',
                  {
                    notificationType: 'commission_milestone',
                    commissionAmount: 500000
                  }
                )
              }>
                Test Milestone
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Client Logs</h3>
              <Button variant="ghost" size="sm" onClick={clearLogs}>Clear</Button>
            </div>
            <Textarea 
              readOnly 
              value={logs.join('\n')} 
              className="font-mono text-xs h-[200px]" 
            />
            
            <div className="flex justify-between mt-4 mb-2">
              <h3 className="text-sm font-medium">Edge Function Logs</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchEdgeFunctionLogs}
                disabled={isLoadingLogs}
              >
                Refresh Logs
              </Button>
            </div>
            <Textarea 
              readOnly 
              value={functionLogs.join('\n')} 
              className="font-mono text-xs h-[200px]" 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationDebugger;
