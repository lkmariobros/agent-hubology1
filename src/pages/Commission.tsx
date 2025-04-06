
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Commission = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Commission</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Commission Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Commission management content will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Commission;
