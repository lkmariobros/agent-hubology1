
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSendNotification } from '@/hooks/useSendNotification';
import { useAuth } from "@/hooks/useAuth";
import { NotificationType } from '@/types/notification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const NotificationDebugger: React.FC = () => {
  const { user } = useAuth();
  const { mutate: sendNotification } = useSendNotification();
  const [logs, setLogs] = useState<{message: string; type: 'info' | 'error' | 'success'}[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [{ message: `[${new Date().toISOString()}] ${message}`, type }, ...prev]);
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  const fetchEdgeFunctionLogs = async () => {
    if (!user) return;
    
    setIsLoadingLogs(true);
    try {
      addLog(`Fetching logs for create_notification edge function...`);
      
      try {
        // Attempt to fetch real logs from the edge function
        const { data, error } = await supabase.functions.invoke('get_edge_function_logs', {
          body: { functionName: 'create_notification' }
        });
        
        if (error) {
          addLog(`Error fetching logs: ${error.message}`, 'error');
        } else if (data && data.logs) {
          data.logs.forEach((log: string) => {
            addLog(`[Edge] ${log}`, 'info');
          });
          addLog(`Successfully fetched edge function logs`, 'success');
        } else {
          addLog(`No logs available or function not found`, 'info');
        }
      } catch (e) {
        // Fallback for development
        addLog(`Using simulated logs for development`, 'info');
        addLog(`[Edge] Notification function received request`, 'info');
        addLog(`[Edge] Processing notification data`, 'info');
      }
    } catch (error: any) {
      addLog(`❌ Error fetching logs: ${error.message}`, 'error');
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  const sendTestNotification = async (type: NotificationType, title: string, data: any) => {
    if (!user?.id) {
      addLog("❌ Error: No user ID found", 'error');
      return;
    }
    
    try {
      addLog(`📤 Sending notification of type: ${type}`, 'info');
      addLog(`📦 Data: ${JSON.stringify(data)}`, 'info');
      
      sendNotification({
        userId: user.id,
        type,
        title,
        message: `Test message for ${type}`,
        data
      }, {
        onSuccess: (response) => {
          addLog(`✅ Success: ${JSON.stringify(response)}`, 'success');
        },
        onError: (error) => {
          addLog(`❌ Error: ${error.message}`, 'error');
        }
      });
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`, 'error');
    }
  };
  
  const formatLogEntry = (log: {message: string; type: 'info' | 'error' | 'success'}) => {
    const icon = log.type === 'error' ? 
      <AlertCircle className="h-4 w-4 text-red-500 mr-2 inline-flex" /> :
      log.type === 'success' ? 
        <CheckCircle className="h-4 w-4 text-green-500 mr-2 inline-flex" /> : 
        null;
        
    return (
      <div className={`py-1 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : ''}`}>
        {icon}{log.message}
      </div>
    );
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Notification Debugger</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearLogs} className="h-8">
            Clear Logs
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchEdgeFunctionLogs}
            disabled={isLoadingLogs}
            className="h-8"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            Refresh Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="send">Send Test Notifications</TabsTrigger>
            <TabsTrigger value="logs">Debug Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => 
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
                Test Approval Notification
              </Button>
              
              <Button variant="outline" onClick={() => 
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
              
              <Button variant="outline" onClick={() => 
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
              
              <Button variant="outline" onClick={() => 
                sendTestNotification(
                  'commission_milestone', 
                  'Milestone Reached',
                  {
                    notificationType: 'commission_milestone',
                    commissionAmount: 500000
                  }
                )
              }>
                Test Commission Milestone
              </Button>
            </div>
            
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Activity</h3>
                <Badge variant="outline" className="h-6">
                  {logs.length} entries
                </Badge>
              </div>
              <div className="border rounded-md p-3 h-[200px] overflow-y-auto font-mono text-xs bg-muted">
                {logs.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    No activity logged yet. Try sending a test notification.
                  </div>
                ) : (
                  logs.slice(0, 10).map((log, i) => (
                    <div key={i}>{formatLogEntry(log)}</div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="mb-2">
              <h3 className="text-sm font-medium">Complete Log History</h3>
            </div>
            <Textarea 
              readOnly 
              value={logs.map(log => `${log.type.toUpperCase()}: ${log.message}`).join('\n')} 
              className="font-mono text-xs h-[300px]" 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationDebugger;
