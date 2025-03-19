import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Sample users data
const users: User[] = [{
  id: '1',
  name: 'John Smith',
  email: 'john@example.com',
  role: 'agent',
  tier: 'senior',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
}, {
  id: '2',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  role: 'agent',
  tier: 'principal',
  avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
}, {
  id: '3',
  name: 'Michael Brown',
  email: 'michael@example.com',
  role: 'agent',
  tier: 'associate',
  avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
}, {
  id: '4',
  name: 'Emily Davis',
  email: 'emily@example.com',
  role: 'manager',
  tier: 'director',
  avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
}, {
  id: '5',
  name: 'Robert Wilson',
  email: 'robert@example.com',
  role: 'agent',
  tier: 'junior',
  avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
}, {
  id: '6',
  name: 'Lisa Anderson',
  email: 'lisa@example.com',
  role: 'agent',
  tier: 'associate',
  avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
}, {
  id: '7',
  name: 'David Martinez',
  email: 'david@example.com',
  role: 'agent',
  tier: 'senior',
  avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
}, {
  id: '8',
  name: 'Jennifer Taylor',
  email: 'jennifer@example.com',
  role: 'agent',
  tier: 'principal',
  avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
}, {
  id: '9',
  name: 'James Johnson',
  email: 'james@example.com',
  role: 'agent',
  tier: 'associate',
  avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
}, {
  id: '10',
  name: 'Amanda White',
  email: 'amanda@example.com',
  role: 'agent',
  tier: 'senior',
  avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
}];
type TimeFrame = 'week' | 'month' | 'year' | 'all-time';
const PointsLeaderboard = () => {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('month');

  // Sort users by random points (in a real app, this would be actual data)
  const sortedUsers = React.useMemo(() => {
    return [...users].map(user => ({
      ...user,
      points: Math.floor(Math.random() * 2000) + 500
    })).sort((a, b) => b.points - a.points);
  }, [timeFrame]); // Recalculate when timeFrame changes

  return <MainLayout>
      <div className="space-y-6 px-[42px] py-[19px] my-0 mx-[50px]">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Points Leaderboard</h1>
          <p className="text-muted-foreground">
            Track agent performance based on achievement points.
          </p>
        </div>

        {/* Time Frame Selector */}
        <div className="flex space-x-2">
          <Badge variant={timeFrame === 'week' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setTimeFrame('week')}>
            This Week
          </Badge>
          <Badge variant={timeFrame === 'month' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setTimeFrame('month')}>
            This Month
          </Badge>
          <Badge variant={timeFrame === 'year' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setTimeFrame('year')}>
            This Year
          </Badge>
          <Badge variant={timeFrame === 'all-time' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setTimeFrame('all-time')}>
            All Time
          </Badge>
        </div>

        {/* Leaderboard Card */}
        <Card className="glass-card overflow-hidden">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-semibold">Points Ranking</CardTitle>
          </CardHeader>
          
          <CardContent className="px-6 py-0 pb-6">
            <div className="space-y-4">
              {sortedUsers.map((user, index) => <div key={user.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 text-center">
                    <div className={cn("w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs font-medium", index === 0 ? "bg-property-orange text-white" : index === 1 ? "bg-property-purple text-white" : index === 2 ? "bg-property-pink text-white" : "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-white/10" /> : <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-accent">
                          {user.name.charAt(0)}
                        </span>
                      </div>}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.role === 'agent' ? user.tier : user.role}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {user.points}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>;
};
export default PointsLeaderboard;