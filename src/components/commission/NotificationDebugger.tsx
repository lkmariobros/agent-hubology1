
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
import { AlertCircle, CheckCircle, RefreshCw, BarChart } from 'lucide-react';

const NotificationDebugger: React.FC = () => {
  const { user } = useAuth();
  const { mutate: sendNotification } = useSendNotification();
  const [logs, setLogs] = useState<{message: string; type: 'info' | 'error' | 'success'}[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [usageStats, setUsageStats] = useState<{
    total: number;
    edge: number;
    local: number;
  }>({ total: 0, edge: 0, local: 0 });
  
  useEffect(() => {
    // Load usage stats from localStorage
    const edgeCount = parseInt(localStorage.getItem('edge_function_usage_count') || '0', 10);
    const totalCount = parseInt(localStorage.getItem('notification_total_count') || '0', 10);
    
    setUsageStats({
      total: totalCount,
      edge: edgeCount,
      local: totalCount - edgeCount
    });
  }, []);
  
  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [{ message: `[${new Date().toISOString()}] ${message}`, type }, ...prev]);
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  // Reset usage counters
  const resetUsageCounters = () => {
    localStorage.setItem('edge_function_usage_count', '0');
    localStorage.setItem('notification_total_count', '0');
    setUsageStats({ total: 0, edge: 0, local: 0 });
    addLog('Usage counters have been reset', 'success');
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
        
        // Add warning about usage limits
        addLog(`[Edge] Warning: You have exceeded your Free Plan edge function invocation quota (754%)`, 'error');
        addLog(`[Edge] Consider upgrading your plan or implementing local fallbacks`, 'info');
      }
    } catch (error: any) {
      addLog(`❌ Error fetching logs: ${error.message}`, 'error');
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  const sendTestNotification = async (type: NotificationType, title: string, data: any, priority: 'high' | 'normal' | 'low' = 'normal') => {
    if (!user?.id) {
      addLog("❌ Error: No user ID found", 'error');
      return;
    }
    
    try {
      addLog(`📤 Sending notification of type: ${type} (priority: ${priority})`, 'info');
      addLog(`📦 Data: ${JSON.stringify(data)}`, 'info');
      
      sendNotification({
        userId: user.id,
        type,
        title,
        message: `Test message for ${type}`,
        data,
        priority
      }, {
        onSuccess: (response) => {
          addLog(`✅ Success: ${JSON.stringify(response)}`, 'success');
          
          // Update usage stats
          const edgeCount = parseInt(localStorage.getItem('edge_function_usage_count') || '0', 10);
          const totalCount = parseInt(localStorage.getItem('notification_total_count') || '0', 10) + 1;
          localStorage.setItem('notification_total_count', totalCount.toString());
          
          setUsageStats({
            total: totalCount,
            edge: edgeCount,
            local: totalCount - edgeCount
          });
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
            <TabsTrigger value="send">Test Notifications</TabsTrigger>
            <TabsTrigger value="stats">Usage Statistics</TabsTrigger>
            <TabsTrigger value="logs">Debug Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
              <h3 className="text-sm font-medium text-amber-800 mb-1">Edge Function Usage Warning</h3>
              <p className="text-xs text-amber-700">
                Your Supabase project has exceeded the Free Plan quota for edge function invocations (754%).
                Test notifications below will use priority-based routing to reduce edge function calls.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">High Priority (Edge Function)</h3>
                <Button variant="outline" className="w-full mb-2" onClick={() => 
                  sendTestNotification(
                    'approval_status_change', 
                    'Approval Test',
                    {
                      notificationType: 'approval_approved',
                      commissionAmount: 10000,
                      transactionId: `tx-${Date.now()}`,
                      approvalId: `ap-${Date.now()}`
                    },
                    'high'
                  )
                }>
                  Test Approval (High)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Always uses edge function regardless of quota.
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Normal Priority (Mixed)</h3>
                <Button variant="outline" className="w-full mb-2" onClick={() => 
                  sendTestNotification(
                    'commission_milestone', 
                    'Milestone Reached',
                    {
                      notificationType: 'commission_milestone',
                      commissionAmount: 500000
                    },
                    'normal'
                  )
                }>
                  Test Milestone (Normal)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Uses edge function until session limit is reached.
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Low Priority (Local Only)</h3>
                <Button variant="outline" className="w-full mb-2" onClick={() => 
                  sendTestNotification(
                    'tier_update', 
                    'Tier Progress', 
                    {
                      notificationType: 'tier_progress',
                      progressPercentage: 75
                    },
                    'low'
                  )
                }>
                  Test Progress (Low)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Always uses local fallback to save quota.
                </p>
              </div>
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
          
          <TabsContent value="stats" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Edge Function Usage</h3>
              <Button variant="outline" size="sm" onClick={resetUsageCounters}>
                Reset Counters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 flex flex-col items-center">
                <BarChart className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{usageStats.total}</span>
                <span className="text-sm text-muted-foreground">Total Notifications</span>
              </div>
              
              <div className="border rounded-md p-4 flex flex-col items-center">
                <Badge variant="destructive" className="mb-2 px-3 py-1">Edge</Badge>
                <span className="text-2xl font-bold">{usageStats.edge}</span>
                <span className="text-sm text-muted-foreground">Edge Functions Used</span>
              </div>
              
              <div className="border rounded-md p-4 flex flex-col items-center">
                <Badge variant="secondary" className="mb-2 px-3 py-1">Local</Badge>
                <span className="text-2xl font-bold">{usageStats.local}</span>
                <span className="text-sm text-muted-foreground">Local Fallbacks</span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Quota Saving Strategy</h4>
              <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                <li>High priority notifications always use edge functions</li>
                <li>Normal priority uses edge functions until session limit is reached</li>
                <li>Low priority notifications always use local database insert</li>
                <li>Batching is used to group multiple notifications</li>
              </ul>
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
