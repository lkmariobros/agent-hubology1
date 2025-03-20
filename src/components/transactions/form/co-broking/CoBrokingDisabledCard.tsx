
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CoBrokingDisabledCard: React.FC = () => {
  return (
    <Card className="mt-4 bg-muted/30">
      <CardContent className="p-6">
        <p className="text-center text-muted-foreground">
          No co-broking for this transaction. All commission will be allocated according to the standard commission structure.
        </p>
      </CardContent>
    </Card>
  );
};

export default CoBrokingDisabledCard;
