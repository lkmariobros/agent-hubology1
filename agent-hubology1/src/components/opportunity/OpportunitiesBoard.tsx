
import React from 'react';
import { Opportunity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, DollarSign, MapPin } from 'lucide-react';

interface OpportunitiesBoardProps {
  opportunities: Opportunity[];
  onViewAll?: () => void;
}

const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({ opportunities, onViewAll }) => {
  if (!opportunities || opportunities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No opportunities available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Client Opportunities</CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.slice(0, 3).map((opportunity) => (
            <div 
              key={opportunity.id}
              className="flex flex-col space-y-2 p-3 bg-muted/50 rounded-lg"
            >
              <h3 className="font-medium">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {opportunity.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {opportunity.budget}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {opportunity.location}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {opportunity.postedDate}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  Posted by: {opportunity.postedBy}
                </span>
                <Button size="sm">Contact</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunitiesBoard;
