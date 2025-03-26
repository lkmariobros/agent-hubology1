import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from '@/types';

const users: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Agent',
    tier: 'Gold',
    avatar: '/avatars/avatar-1.png',
    sales: 7850000,
    joinDate: '2021-04-15'
  },
  {
    id: '2',
    name: 'Megan Davis',
    email: 'megan@example.com',
    role: 'Agent',
    tier: 'Silver',
    avatar: '/avatars/avatar-2.png',
    sales: 6200000,
    joinDate: '2022-02-28'
  },
  {
    id: '3',
    name: 'Ryan Chen',
    email: 'ryan@example.com',
    role: 'Agent',
    tier: 'Bronze',
    avatar: '/avatars/avatar-3.png',
    sales: 5100000,
    joinDate: '2022-11-01'
  },
  {
    id: '4',
    name: 'Emily White',
    email: 'emily@example.com',
    role: 'Agent',
    tier: 'Gold',
    avatar: '/avatars/avatar-4.png',
    sales: 4950000,
    joinDate: '2023-01-10'
  },
  {
    id: '5',
    name: 'Kevin Brown',
    email: 'kevin@example.com',
    role: 'Agent',
    tier: 'Silver',
    avatar: '/avatars/avatar-5.png',
    sales: 3800000,
    joinDate: '2023-03-22'
  },
  {
    id: '6',
    name: 'Laura Wilson',
    email: 'laura@example.com',
    role: 'Agent',
    tier: 'Bronze',
    avatar: '/avatars/avatar-6.png',
    sales: 2700000,
    joinDate: '2023-05-05'
  },
  {
    id: '7',
    name: 'David Garcia',
    email: 'david@example.com',
    role: 'Agent',
    tier: 'Gold',
    avatar: '/avatars/avatar-7.png',
    sales: 1950000,
    joinDate: '2023-07-18'
  },
  {
    id: '8',
    name: 'Sophia Rodriguez',
    email: 'sophia@example.com',
    role: 'Agent',
    tier: 'Silver',
    avatar: '/avatars/avatar-8.png',
    sales: 1500000,
    joinDate: '2023-09-01'
  },
  {
    id: '9',
    name: 'Daniel Martinez',
    email: 'daniel@example.com',
    role: 'Agent',
    tier: 'Bronze',
    avatar: '/avatars/avatar-9.png',
    sales: 900000,
    joinDate: '2023-10-12'
  },
  {
    id: '10',
    name: 'Olivia Anderson',
    email: 'olivia@example.com',
    role: 'Agent',
    tier: 'Gold',
    avatar: '/avatars/avatar-10.png',
    sales: 550000,
    joinDate: '2023-12-24'
  },
];

const Sales = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 pr-2">
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <div className="p-3">
            {users.map((user) => (
              <div key={user.id} className="mb-4 flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">{user.role} ({user.tier} Tier)</p>
                </div>
                <div>
                  <p className="text-sm font-medium">${user.sales?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Sales;
