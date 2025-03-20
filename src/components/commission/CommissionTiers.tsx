
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { CommissionTier } from '@/types';

interface CommissionTiersProps {
  tiers: CommissionTier[];
  currentTier: string;
  transactionsCompleted: number;
}

const CommissionTiers = ({
  tiers,
  currentTier,
  transactionsCompleted
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

  const currentTierObj = tiers.find(t => t.tier === currentTier) || tiers[0];
  const nextTierObj = tiers.find(t => t.minTransactions > transactionsCompleted);
  const transactionsToNextTier = nextTierObj ? nextTierObj.minTransactions - transactionsCompleted : 0;
  const progress = nextTierObj ? (transactionsCompleted / nextTierObj.minTransactions) * 100 : 100;

  return (
    <Card className="glass-card">
      <CardHeader className="p-5">
        <CardTitle className="text-lg font-semibold">Commission Tiers</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Current Tier</p>
            <h3 className="text-2xl font-bold text-gradient">
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
            indicatorClassName={cn("bg-gradient-to-r", getProgressColor(currentTierObj.color))} 
          />
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {tiers.map((tier, index) => (
            <div 
              key={tier.tier} 
              className={cn(
                "flex flex-col items-center text-center transition-all rounded-lg py-3 px-2",
                currentTier === tier.tier ? "glass-card ring-1 ring-white/20" : "bg-transparent hover:bg-white/5",
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
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
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
      return 'bg-property-blue';
    case 'purple':
      return 'bg-property-purple';
    case 'pink':
      return 'bg-property-pink';
    case 'orange':
      return 'bg-property-orange';
    case 'green':
      return 'bg-property-green';
    default:
      return 'bg-accent';
  }
}

function getProgressColor(color: string) {
  switch (color) {
    case 'blue':
      return 'from-property-blue/50 to-property-blue';
    case 'purple':
      return 'from-property-purple/50 to-property-purple';
    case 'pink':
      return 'from-property-pink/50 to-property-pink';
    case 'orange':
      return 'from-property-orange/50 to-property-orange';
    case 'green':
      return 'from-property-green/50 to-property-green';
    default:
      return 'from-accent/50 to-accent';
  }
}

export default CommissionTiers;
