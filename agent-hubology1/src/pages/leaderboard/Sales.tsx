
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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

// Calculate highest sales value for progress bar
const maxSales = Math.max(...users.map(user => user.sales || 0));

const Sales = () => {
  return (
    <div>
      {users.map((user, index) => (
        <div 
          key={user.id} 
          className={`mb-5 p-4 rounded-md ${index === 0 ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-card hover:bg-accent/5'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-amber-500 text-white' : 
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-amber-700 text-white' :
                  'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
              >
                {index + 1}
              </span>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold">{user.name}</h3>
                  <div className="flex items-center">
                    <p className="text-xs text-muted-foreground mr-2">{user.role}</p>
                    <Badge variant="outline" className="text-xs h-5">
                      {user.tier}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-right">${user.sales?.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={(user.sales || 0) / maxSales * 100} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sales;
