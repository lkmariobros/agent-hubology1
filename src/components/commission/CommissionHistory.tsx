
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface CommissionHistoryProps {
  commissions: any[];
  limit?: number;
}

const CommissionHistory: React.FC<CommissionHistoryProps> = ({ 
  commissions,
  limit = 10
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get property title and location safely
  const getPropertyTitle = (property: any): string => {
    if (typeof property === 'string') {
      return property;
    }
    return property.title || '';
  };

  const getPropertyLocation = (property: any): string => {
    if (typeof property === 'string') {
      return '';
    }
    return property.location || '';
  };

  const displayCommissions = commissions.slice(0, limit);

  return (
    <div className="space-y-4">
      {displayCommissions.length > 0 ? (
        <>
          {displayCommissions.map((commission) => (
            <div key={commission.id} className="flex items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1 flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getPropertyTitle(commission.property)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(commission.date)} • {getPropertyLocation(commission.property)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatCurrency(commission.amount)}
                </p>
                <Badge variant="outline" className={`text-xs ${commission.type === 'override' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'}`}>
                  {commission.type === 'override' ? 'Override' : 'Personal'}
                  {commission.source && ` • ${commission.source}`}
                </Badge>
              </div>
              
              <Button variant="ghost" size="icon" className="ml-2">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" className="w-full">View All Commissions</Button>
        </>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Commissions Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have any commission history to display
            </p>
            <Button>Create a New Transaction</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommissionHistory;
