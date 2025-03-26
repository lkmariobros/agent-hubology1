
import React from 'react';
import { Opportunity } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, MapPin } from 'lucide-react';
import { useOpportunities } from '@/hooks/useDashboard';

export interface OpportunitiesBoardProps {
  onViewAll: () => void;
}

const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({ onViewAll }) => {
  const { data, isLoading } = useOpportunities();
  const opportunities = data?.data || [];

  // Helper function to determine badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Urgent':
        return 'destructive';
      case 'New':
        return 'default';
      case 'Featured':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Opportunities Board</CardTitle>
          <CardDescription>Client needs posted by agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="bg-muted/40">
                <CardHeader className="p-4 pb-2">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-4 w-full bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Opportunities</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Opportunities Board</CardTitle>
        <CardDescription>Client needs posted by agents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:bg-muted/20 transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{opportunity.title}</CardTitle>
                  <Badge variant={getBadgeVariant(opportunity.status)}>
                    {opportunity.status}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Posted by {opportunity.postedBy}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm mb-3 line-clamp-2">
                  {opportunity.description}
                </p>
                <div className="flex flex-col space-y-2 text-xs">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    <span>{opportunity.budget}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{formatRelativeTime(opportunity.postedDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onViewAll}>
          View All Opportunities
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpportunitiesBoard;
