
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User } from '@/types';

const users: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Agent',
    tier: 'Gold',
    avatar: '/avatars/avatar-1.png',
    points: 2450,
    joinDate: '2021-04-15'
  },
  {
    id: '2',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    role: 'Agent',
    tier: 'Silver',
    avatar: '/avatars/avatar-2.png',
    points: 1870,
    joinDate: '2022-02-28'
  },
  {
    id: '3',
    name: 'Casey Williams',
    email: 'casey@example.com',
    role: 'Agent',
    tier: 'Bronze',
    avatar: '/avatars/avatar-3.png',
    points: 1530,
    joinDate: '2022-11-01'
  },
  {
    id: '4',
    name: 'Taylor Brown',
    email: 'taylor@example.com',
    role: 'Agent',
    tier: 'Silver',
    avatar: '/avatars/avatar-4.png',
    points: 1290,
    joinDate: '2023-01-10'
  },
  {
    id: '5',
    name: 'Morgan Davis',
    email: 'morgan@example.com',
    role: 'Agent',
    tier: 'Bronze',
    avatar: '/avatars/avatar-5.png',
    points: 950,
    joinDate: '2023-03-22'
  },
  {
    id: '6',
    name: 'Riley Miller',
    email: 'riley@example.com',
    role: 'Agent',
    tier: 'Gold',
    avatar: '/avatars/avatar-6.png',
    points: 780,
    joinDate: '2023-05-05'
  },
  {
    id: '7',
    name: 'Drew Wilson',
    email: 'drew@example.com',
    role: 'Agent',
    tier: 'Silver',
    avatar: '/avatars/avatar-7.png',
    points: 610,
    joinDate: '2023-07-18'
  },
  {
    id: '8',
    name: 'Jamie Moore',
    email: 'jamie@example.com',
    role: 'Agent',
    tier: 'Bronze',
    avatar: '/avatars/avatar-8.png',
    points: 440,
    joinDate: '2023-09-30'
  },
  {
    id: '9',
    name: 'Blake Green',
    email: 'blake@example.com',
    role: 'Agent',
    tier: 'Silver',
    avatar: '/avatars/avatar-9.png',
    points: 270,
    joinDate: '2023-12-12'
  },
  {
    id: '10',
    name: 'Avery Hall',
    email: 'avery@example.com',
    role: 'Agent',
    tier: 'Bronze',
    avatar: '/avatars/avatar-10.png',
    points: 100,
    joinDate: '2024-01-25'
  },
];

const PointsLeaderboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="font-bold">{user.points} Points</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsLeaderboard;
