
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

const CoBrokingDisabledCard: React.FC = () => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="text-sm font-medium">Co-Broking Disabled</h3>
            <p className="text-sm text-muted-foreground mt-1">
              If this transaction involves another broker, enable co-broking to configure commission splitting and record the co-broker's details.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoBrokingDisabledCard;
