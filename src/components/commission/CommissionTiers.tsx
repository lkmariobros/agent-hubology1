
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

interface CommissionTier {
  id: string;
  name: string;
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
  rank: string;
  percentage: number;
  commissionRate: number;
  requirements: string[];
}

interface CommissionTiersProps {
  tiers: CommissionTier[];
  currentTier: string;
  transactionsCompleted?: number;
  salesVolume?: number;
}

const CommissionTiers = ({
  tiers,
  currentTier,
  transactionsCompleted = 0,
  salesVolume = 0
}: CommissionTiersProps) => {
  // Check if tiers array is empty or undefined
  if (!tiers || tiers.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader className="p-5">
          <CardTitle className="text-lg font-semibold">Commission Tiers</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <p className="text-muted-foreground">No commission tiers available</p>
        </CardContent>
      </Card>
    );
  }

  // Use either transactionsCompleted or simulate from salesVolume
  const effectiveTransactions = transactionsCompleted || Math.floor(salesVolume / 100000);
  
  const currentTierObj = tiers.find(t => t.tier === currentTier) || tiers[0];
  const nextTierObj = tiers.find(t => t.minTransactions > effectiveTransactions);
  const transactionsToNextTier = nextTierObj ? nextTierObj.minTransactions - effectiveTransactions : 0;
  const progress = nextTierObj ? (effectiveTransactions / nextTierObj.minTransactions) * 100 : 100;

  return (
    <Card className="glass-card">
      <CardHeader className="p-5">
        <CardTitle className="text-lg font-semibold">Commission Tiers</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Current Tier</p>
            <h3 className="text-2xl font-bold">
              {currentTierObj.tier}
            </h3>
            <p className="text-xs text-muted-foreground">
              {nextTierObj 
                ? `${transactionsToNextTier} more transaction${transactionsToNextTier !== 1 ? 's' : ''} to next tier` 
                : 'Maximum tier reached'}
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full">
            <div className="text-center">
              <span className="text-2xl font-bold">{currentTierObj.rate}%</span>
              <p className="text-xs text-muted-foreground">Commission</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress to next tier</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2" 
          />
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {tiers.map((tier, index) => (
            <div 
              key={tier.tier} 
              className={cn(
                "flex flex-col items-center text-center transition-all rounded-lg py-3 px-2",
                currentTier === tier.tier ? "bg-muted ring-1 ring-primary/20" : "bg-transparent hover:bg-muted/30",
                index < tiers.findIndex(t => t.tier === currentTier) && "opacity-70"
              )}
            >
              <div 
                className={cn(
                  "w-10 h-10 mb-2.5 rounded-full flex items-center justify-center text-white font-medium",
                  getTierColor(tier.color)
                )}
              >
                {index + 1}
              </div>
              <p className="text-xs font-medium truncate mb-0.5">{tier.tier}</p>
              <p className="text-xs text-muted-foreground">{tier.rate}%</p>
              {currentTier === tier.tier && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

function getTierColor(color: string) {
  switch (color) {
    case 'blue':
      return 'bg-blue-500';
    case 'purple':
      return 'bg-purple-500';
    case 'pink':
      return 'bg-pink-500';
    case 'orange':
      return 'bg-orange-500';
    case 'green':
      return 'bg-green-500';
    default:
      return 'bg-primary';
  }
}

export default CommissionTiers;
