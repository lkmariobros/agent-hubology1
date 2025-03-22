
import React from 'react';
import { cn } from '@/lib/utils';
import { Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'properties' | 'transactions' | 'opportunities' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className,
  icon
}) => {
  // Default values based on type
  let defaultTitle = "No data";
  let defaultDescription = "No data available at this time.";
  let defaultIcon = null;
  let defaultAction = "Add new";
  
  switch (type) {
    case 'properties':
      defaultTitle = "No properties found";
      defaultDescription = "There are no properties in your inventory yet.";
      defaultIcon = <Building2 className="h-12 w-12 text-muted-foreground/30" />;
      defaultAction = "Add property";
      break;
    case 'transactions':
      defaultTitle = "No transactions found";
      defaultDescription = "There are no transactions recorded yet.";
      defaultIcon = <DollarSign className="h-12 w-12 text-muted-foreground/30" />;
      defaultAction = "Create transaction";
      break;
    case 'opportunities':
      defaultTitle = "No opportunities found";
      defaultDescription = "There are no client opportunities available.";
      defaultIcon = <Building2 className="h-12 w-12 text-muted-foreground/30" />;
      defaultAction = "Add opportunity";
      break;
  }
  
  // Use provided values or defaults
  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;
  const displayIcon = icon || defaultIcon;
  const displayAction = actionLabel || defaultAction;
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center px-4 py-12 text-center",
      className
    )}>
      <div className="bg-muted-30 rounded-full p-4 mb-4">
        {displayIcon}
      </div>
      <h3 className="text-lg font-medium mb-1">{displayTitle}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{displayDescription}</p>
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          {displayAction}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
