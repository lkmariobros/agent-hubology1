
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AgentWithHierarchy } from '@/types';
import { formatCurrency } from '@/utils/propertyUtils';
import { CalendarIcon, PhoneIcon, MailIcon, TrendingUpIcon, Users2Icon } from 'lucide-react';
import { format } from 'date-fns';

interface AgentDetailsProps {
  agent: AgentWithHierarchy;
  isAdmin?: boolean;
}

const AgentDetails: React.FC<AgentDetailsProps> = ({ agent, isAdmin = false }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback>{agent.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{agent.name}</h3>
                <Badge variant="outline">{agent.rank}</Badge>
              </div>
              
              <div className="flex flex-col space-y-1 text-sm">
                {agent.email && (
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.email}</span>
                  </div>
                )}
                
                {agent.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.phone}</span>
                  </div>
                )}
                
                {agent.joinDate && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {format(new Date(agent.joinDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users2Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{agent.downline?.length || 0} Team Members</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-lg font-medium">{formatCurrency(agent.salesVolume || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg font-medium">{agent.transactions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Commission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Personal</p>
                <p className="text-lg font-medium">{formatCurrency(agent.personalCommission || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Override</p>
                <p className="text-lg font-medium">{formatCurrency(agent.overrideCommission || 0)}</p>
              </div>
              {isAdmin && (
                <>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Commission Rate</p>
                    <p className="text-lg font-medium">{agent.commission}%</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isAdmin && agent.downline && agent.downline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Size</span>
                <span>{agent.downline.length} direct reports</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Team Sales</span>
                <span>
                  {formatCurrency(
                    agent.downline.reduce(
                      (sum, member) => sum + (member?.salesVolume || 0), 
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Transactions</span>
                <span>
                  {agent.downline.reduce(
                    (sum, member) => sum + (member?.transactions || 0), 
                    0
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Override Commission</span>
                <span>{formatCurrency(agent.overrideCommission || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentDetails;
