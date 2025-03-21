
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Mail, Phone, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample users data
const users: User[] = [{
  id: '1',
  name: 'John Smith',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  role: 'agent',
  tier: 'senior',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  properties: 42,
  transactions: 18
}, {
  id: '2',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '+1 (555) 234-5678',
  role: 'agent',
  tier: 'principal',
  avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  properties: 78,
  transactions: 36
}, {
  id: '3',
  name: 'Michael Brown',
  email: 'michael@example.com',
  phone: '+1 (555) 345-6789',
  role: 'agent',
  tier: 'associate',
  avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  properties: 29,
  transactions: 11
}, {
  id: '4',
  name: 'Emily Davis',
  email: 'emily@example.com',
  phone: '+1 (555) 456-7890',
  role: 'manager',
  tier: 'director',
  avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  properties: 56,
  transactions: 22
}, {
  id: '5',
  name: 'Robert Wilson',
  email: 'robert@example.com',
  phone: '+1 (555) 567-8901',
  role: 'agent',
  tier: 'junior',
  avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
  properties: 17,
  transactions: 4
}];
const getRoleBadge = (role: string) => {
  switch (role) {
    case 'agent':
      return <Badge variant="outline">Agent</Badge>;
    case 'manager':
      return <Badge variant="secondary">Manager</Badge>;
    case 'admin':
      return <Badge>Admin</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};
const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'junior':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Junior</Badge>;
    case 'associate':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Associate</Badge>;
    case 'senior':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Senior</Badge>;
    case 'principal':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Principal</Badge>;
    case 'director':
      return <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">Director</Badge>;
    default:
      return <Badge variant="outline">{tier}</Badge>;
  }
};
const Team = () => {
  return (
    <div className="space-y-6 px-[31px] py-[3px]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <Button className="gap-2">
          <Plus size={16} />
          Add Team Member
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search by name, email..." className="w-full" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleBadge(user.role)}
                      {getTierBadge(user.tier)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-muted p-1">
                      <Mail className="h-3 w-3" />
                    </div>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-muted p-1">
                      <Phone className="h-3 w-3" />
                    </div>
                    <span className="truncate">{user.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 border-t border-border">
                <div className="p-4 text-center border-r border-border">
                  <div className="text-2xl font-bold">{user.properties}</div>
                  <div className="text-xs text-muted-foreground">Properties</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold">{user.transactions}</div>
                  <div className="text-xs text-muted-foreground">Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>
    </div>
  );
};
export default Team;
