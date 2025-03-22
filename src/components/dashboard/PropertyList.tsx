
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types";
import { PropertyCardBasicInfo } from "../property/PropertyCardBasicInfo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState";

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  isLoading = false,
  onViewAll,
  className
}) => {
  return (
    <Card className={cn("border-border bg-card shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
        <CardTitle className="text-lg font-medium">Latest Properties</CardTitle>
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
        ) : properties.length > 0 ? (
          <div className="divide-y divide-border">
            {properties.map((property) => (
              <PropertyCardBasicInfo
                key={property.id}
                property={property}
                isOpen={false}
                className="p-4"
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            type="properties" 
            onAction={onViewAll}
            actionLabel="Add property"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyList;
