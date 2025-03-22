
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Flag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpportunities } from "@/hooks/useDashboard";
import EmptyState from "./EmptyState";

interface OpportunitiesBoardProps {
  onViewAll?: () => void;
  className?: string;
}

const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({
  onViewAll,
  className
}) => {
  const { data, isLoading } = useOpportunities();
  const opportunities = data?.data || [];

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Urgent':
        return <Clock className="h-3 w-3 text-red-500" />;
      case 'Featured':
        return <Star className="h-3 w-3 text-amber-500" />;
      case 'New':
        return <Flag className="h-3 w-3 text-emerald-500" />;
      default:
        return null;
    }
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Urgent':
        return "bg-red-500/10 text-red-500";
      case 'Featured':
        return "bg-amber-500/10 text-amber-500";
      case 'New':
        return "bg-emerald-500/10 text-emerald-500";
      default:
        return "bg-muted-foreground/10 text-muted-foreground";
    }
  };

  return (
    <Card className={cn("border-border bg-card shadow-sm h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
        <CardTitle className="text-lg font-medium">Opportunities Board</CardTitle>
        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : opportunities.length > 0 ? (
          <div className="divide-y divide-border">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium line-clamp-1">{opportunity.title}</h4>
                  <span className={cn(
                    "inline-flex items-center text-xs px-2 py-1 rounded-full gap-1",
                    getStatusColor(opportunity.status)
                  )}>
                    {getStatusIcon(opportunity.status)}
                    {opportunity.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {opportunity.description}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground/80">
                    {opportunity.propertyType} • {opportunity.location}
                  </span>
                  <span className="font-medium">
                    {opportunity.budget}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            type="opportunities" 
            onAction={onViewAll}
            actionLabel="View opportunities"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OpportunitiesBoard;
