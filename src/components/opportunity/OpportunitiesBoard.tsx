
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Briefcase, Clock } from 'lucide-react';
import { Opportunity } from '@/types';

export interface OpportunitiesBoardProps {
  opportunities: Opportunity[];
  onViewAll: () => void;
}

const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({ opportunities, onViewAll }) => {
  if (!opportunities || opportunities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No opportunities available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {opportunities.map((opportunity) => (
        <Card key={opportunity.id}>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium line-clamp-1">{opportunity.title}</h3>
              <Badge variant={opportunity.status === 'open' ? 'default' : 'secondary'}>
                {opportunity.status === 'open' ? 'Open' : 'Pending'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {opportunity.description}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {opportunity.propertyType}
              </div>
              <div>Budget: {opportunity.budget}</div>
              <div>Location: {opportunity.location}</div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(opportunity.postedDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center">
        <Button variant="link" onClick={onViewAll}>
          View All Opportunities
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OpportunitiesBoard;
