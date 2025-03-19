
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AgentWithHierarchy } from '@/types';

interface AgentDetailsProps {
  agent: AgentWithHierarchy;
}

const AgentDetails: React.FC<AgentDetailsProps> = ({ agent }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              {agent.avatar ? (
                <img 
                  src={agent.avatar} 
                  alt={agent.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold">
                  {agent.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.rank}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{agent.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{agent.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Join Date</p>
              <p className="font-medium">
                {new Date(agent.joinDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="font-medium">{agent.transactions}</p>
            </div>
          </div>
          
          <div className="pt-4 space-y-2">
            <h4 className="font-medium">Commission</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Personal</p>
                <p className="font-bold">
                  ${agent.personalCommission.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Override</p>
                <p className="font-bold">
                  ${agent.overrideCommission.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold">
                  ${agent.totalCommission.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button variant="outline" size="sm">
              Edit Agent
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  Add Downline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Agent</DialogTitle>
                  <DialogDescription>
                    Add a new agent under {agent.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-center text-muted-foreground">
                    New agent form would go here
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentDetails;
