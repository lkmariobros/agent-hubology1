
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropertyLoadingSkeleton = () => {
  return (
    <div className="p-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      
      {/* Property Summary Card Skeleton */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Skeleton */}
            <div>
              <Skeleton className="aspect-video w-full mb-3" />
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
              </div>
            </div>
            
            {/* Info Skeleton */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              
              <Skeleton className="h-10 w-32 mb-6" />
              
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="grid grid-cols-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              {['Details', 'Owner', 'Transactions', 'Documents', 'History'].map((tab, i) => (
                <TabsTrigger key={i} value={tab.toLowerCase()} disabled>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
        
        {/* Team Notes Skeleton */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
                <Skeleton className="h-24 w-full mt-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyLoadingSkeleton;
