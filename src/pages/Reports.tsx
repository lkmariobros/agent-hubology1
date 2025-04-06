
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Reports = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reports Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Reporting functionality will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
