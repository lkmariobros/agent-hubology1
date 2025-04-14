
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  users: User[];
  period?: 'week' | 'month' | 'year';
}

const Leaderboard = ({ users, period = 'month' }: LeaderboardProps) => {
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="px-6 pt-6 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
          View all
        </Button>
      </CardHeader>
      
      <Tabs defaultValue={period} className="w-full">
        <div className="px-6 pt-4 pb-0">
          <TabsList className="w-full grid grid-cols-3 bg-sidebar-accent/50">
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="year">Yearly</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="px-6 pt-4 pb-6">
          {['week', 'month', 'year'].map((tabPeriod) => (
            <TabsContent key={tabPeriod} value={tabPeriod} className="space-y-4 mt-0">
              {users
                .slice()
                .sort((a, b) => Math.random() - 0.5) // Mock sorting by different periods
                .slice(0, 5)
                .map((user, index) => (
                <div 
                  key={user.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 text-center">
                    <div 
                      className={cn(
                        "w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs font-medium",
                        index === 0 ? "bg-property-orange text-white" :
                        index === 1 ? "bg-property-purple text-white" :
                        index === 2 ? "bg-property-pink text-white" :
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-accent">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.role === 'agent' && user.tier ? user.tier : user.role}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {Math.floor(Math.random() * 2000) + 500}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default Leaderboard;
