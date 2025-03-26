
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Download, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SystemLogs = () => {
  // Sample log data
  const logs = [
    { id: 1, timestamp: '2023-05-15 14:23:45', level: 'ERROR', message: 'Failed to connect to payment gateway', user: 'system', source: 'PaymentService' },
    { id: 2, timestamp: '2023-05-15 14:22:32', level: 'WARNING', message: 'High server load detected', user: 'system', source: 'MonitoringService' },
    { id: 3, timestamp: '2023-05-15 14:19:01', level: 'INFO', message: 'User profile updated', user: 'john.doe@example.com', source: 'UserService' },
    { id: 4, timestamp: '2023-05-15 14:17:56', level: 'INFO', message: 'Property listing #12458 created', user: 'emma.smith@example.com', source: 'PropertyService' },
    { id: 5, timestamp: '2023-05-15 14:15:22', level: 'WARNING', message: 'Rate limit exceeded for API key', user: 'api-service', source: 'ApiGateway' },
    { id: 6, timestamp: '2023-05-15 14:09:45', level: 'ERROR', message: 'Database connection timeout', user: 'system', source: 'DatabaseService' },
    { id: 7, timestamp: '2023-05-15 14:05:11', level: 'INFO', message: 'New user registered', user: 'system', source: 'AuthenticationService' },
    { id: 8, timestamp: '2023-05-15 14:01:23', level: 'INFO', message: 'Scheduled maintenance completed', user: 'system', source: 'MaintenanceService' },
  ];

  return (
    <div className="space-y-6 px-[44px] py-[36px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor system activities and troubleshoot issues.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="error">Errors</TabsTrigger>
          <TabsTrigger value="warning">Warnings</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Events
              </CardTitle>
              <CardDescription>
                Recent system activities and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{log.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.level === 'ERROR' ? 'bg-red-100 text-red-800' : 
                            log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{log.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{log.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{log.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* We'll use the same content for other tabs in this placeholder */}
        <TabsContent value="error" className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Error logs will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="warning" className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Warning logs will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info" className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Information logs will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Audit trail will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemLogs;
