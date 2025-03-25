
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CoBrokingDisabledCard: React.FC = () => {
  return (
    <Card className="bg-muted/20">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Co-broking is disabled</h3>
          <p className="text-muted-foreground max-w-md">
            Enable co-broking if this transaction involves another agent from a different agency. 
            This will allow you to split the commission accordingly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoBrokingDisabledCard;
