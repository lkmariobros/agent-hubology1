
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  calculateStockPercentage,
  getStockStatusLabel,
  getStockStatusClass
} from '@/utils/propertyUtils.tsx';
import { cn } from '@/lib/utils';

interface PropertyStock {
  total: number;
  available: number;
  reserved?: number;
  sold?: number;
}

interface PropertyStockInfoProps {
  stock: PropertyStock;
  compact?: boolean;
  className?: string;
}

export function PropertyStockInfo({ 
  stock, 
  compact = false,
  className 
}: PropertyStockInfoProps) {
  // If there's no stock data or total is 0, we don't show this component
  if (!stock || stock.total === 0) {
    return null;
  }

  // Calculate stock percentage
  const availablePercentage = calculateStockPercentage(stock.available, stock.total);
  const statusLabel = getStockStatusLabel(availablePercentage);
  const statusClass = getStockStatusClass(availablePercentage);

  // For compact display (used in cards, etc.)
  if (compact) {
    return (
      <div className={cn("flex items-center", className)}>
        <Badge variant="outline" className={cn("text-xs", statusClass)}>
          {statusLabel}: {stock.available}/{stock.total} units
        </Badge>
      </div>
    );
  }

  // Full display with progress bar (used in detail pages)
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium">Stock Status</span>
          <Badge variant="outline" className={cn("ml-2 text-xs", statusClass)}>
            {statusLabel}
          </Badge>
        </div>
        <span className="text-sm">{stock.available} of {stock.total} units available</span>
      </div>
      
      <Progress 
        value={availablePercentage} 
        className="h-2" 
        indicatorClassName={cn(
          availablePercentage === 0 ? "bg-red-500" :
          availablePercentage <= 25 ? "bg-orange-500" :
          availablePercentage <= 50 ? "bg-yellow-500" :
          availablePercentage <= 75 ? "bg-blue-500" :
          "bg-green-500"
        )}
      />
      
      {/* Show detailed breakdown if we have reserved or sold data */}
      {(stock.reserved !== undefined || stock.sold !== undefined) && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
          <div className="bg-green-500/10 p-2 rounded-md">
            <span className="block text-green-500 font-medium">Available</span>
            <span className="block mt-1">{stock.available} units</span>
          </div>
          
          {stock.reserved !== undefined && (
            <div className="bg-yellow-500/10 p-2 rounded-md">
              <span className="block text-yellow-500 font-medium">Reserved</span>
              <span className="block mt-1">{stock.reserved} units</span>
            </div>
          )}
          
          {stock.sold !== undefined && (
            <div className="bg-red-500/10 p-2 rounded-md">
              <span className="block text-red-500 font-medium">Sold</span>
              <span className="block mt-1">{stock.sold} units</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
