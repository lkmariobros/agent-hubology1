import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Calendar, Users, Plus, Download, Filter, ChevronDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import CommissionTiers from '@/components/commission/CommissionTiers';
import CommissionHistoryComponent from '@/components/commission/CommissionHistory';
import AgentHierarchyChart from '@/components/commission/AgentHierarchyChart';
import CommissionCalculator from '@/components/commission/CommissionCalculator';
import { 
  useCommissionSummary,
  useCommissionTiers, 
  useCommissionHistory,
  useAgentHierarchy
} from '@/hooks/useCommission';
import { AgentWithHierarchy, CommissionHistory, CommissionTier } from '@/types';

// Sample commission tiers for fallback when API fails
const fallbackTiers: CommissionTier[] = [
  { tier: 'Bronze', rate: 20, minTransactions: 0, color: 'orange' },
  { tier: 'Silver', rate: 25, minTransactions: 10, color: 'blue' },
  { tier: 'Gold', rate: 30, minTransactions: 25, color: 'orange' },
  { tier: 'Platinum', rate: 35, minTransactions: 50, color: 'purple' },
  { tier: 'Diamond', rate: 40, minTransactions: 100, color: 'pink' }
];

// Sample agent hierarchy for fallback when API fails
const fallbackAgentHierarchy: AgentWithHierarchy = {
  id: 'agent123',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '+1-555-123-4567',
  avatar: '',
  rank: 'Team Leader',
  joinDate: '2023-01-15',
  transactions: 42,
  salesVolume: 4500000,
  personalCommission: 112500,
  overrideCommission: 45000,
  totalCommission: 157500,
  downline: [
    {
      id: 'agent456',
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      phone: '+1-555-987-6543',
      avatar: '',
      rank: 'Sales Leader',
      joinDate: '2023-03-10',
      transactions: 28,
      salesVolume: 2800000,
      personalCommission: 70000,
      overrideCommission: 15000,
      totalCommission: 85000,
      downline: []
    }
  ]
};

// Sample recent commission history (would come from API in production)
const recentCommissions: CommissionHistory[] = [
  {
    id: '1',
    transactionId: 'tx1',
    property: {
      title: 'Suburban Family Home',
      location: 'Palo Alto, CA'
    },
    date: '2024-02-15T10:30:00Z',
    amount: 22500,
    type: 'personal'
  },
  {
    id: '2',
    transactionId: 'tx2',
    property: {
      title: 'Downtown Loft',
      location: 'San Francisco, CA'
    },
    date: '2024-02-28T09:15:00Z',
    amount: 30000,
    type: 'personal'
  },
  {
    id: '3',
    transactionId: 'tx3',
    property: {
      title: 'Luxury Beach Condo',
      location: 'Santa Monica, CA'
    },
    date: '2024-03-10T14:45:00Z',
    amount: 8500,
    type: 'override',
    source: 'Robert Wilson'
  },
  {
    id: '4',
    transactionId: 'tx4',
    property: {
      title: 'Modern Townhouse',
      location: 'Berkeley, CA'
    },
    date: '2024-03-18T11:20:00Z',
    amount: 6200,
    type: 'override',
    source: 'Emily Davis'
  }
];

// Sample commission data - would come from API in production
const currentMonth = {
  earned: 12750,
  target: 20000,
  progress: 63.75
};

const previousMonth = {
  earned: 18900,
  target: 20000,
  progress: 94.5
};

const yearToDate = {
  earned: 89500,
  target: 150000,
  progress: 59.67
};

const Commission = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<AgentWithHierarchy | null>(null);
  
  // Fetch commission data - in production, these would use real API calls
  // const { data: commissionSummary, isLoading: isLoadingSummary } = useCommissionSummary();
  const { data: commissionTiersResponse, isLoading: isLoadingTiers } = useCommissionTiers();
  // const { data: commissionHistory, isLoading: isLoadingHistory } = useCommissionHistory();
  const { data: agentHierarchyResponse, isLoading: isLoadingHierarchy } = useAgentHierarchy('agent123');

  // Extract and provide fallbacks for API data
  const commissionTiers = commissionTiersResponse || fallbackTiers;
  const agentHierarchy = agentHierarchyResponse || fallbackAgentHierarchy;

  const handleAgentClick = (agent: AgentWithHierarchy) => {
    setSelectedAgent(agent);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Commission Dashboard</h1>
            <p className="text-muted-foreground">
              Track your commission earnings, team performance, and progress towards targets.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Record New Transaction</DialogTitle>
                  <DialogDescription>
                    Enter the transaction details to calculate and distribute commission.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-center text-muted-foreground">Transaction form would go here</p>
                </div>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Commission Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="team">Team Hierarchy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">${currentMonth.earned.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">/ ${currentMonth.target.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={currentMonth.progress} 
                    className="h-2 mt-4" 
                    indicatorClassName="bg-property-blue"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {currentMonth.progress}% of monthly target
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Previous Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">${previousMonth.earned.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">/ ${previousMonth.target.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={previousMonth.progress} 
                    className="h-2 mt-4" 
                    indicatorClassName="bg-property-purple"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {previousMonth.progress}% of monthly target
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">${yearToDate.earned.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">/ ${yearToDate.target.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={yearToDate.progress} 
                    className="h-2 mt-4" 
                    indicatorClassName="bg-property-pink"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {yearToDate.progress}% of yearly target
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CommissionHistoryComponent commissions={recentCommissions} />
              </div>
              
              <div>
                <CommissionTiers 
                  tiers={commissionTiers} 
                  currentTier="Silver" 
                  transactionsCompleted={15}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Personal Sales Commission</span>
                      <span className="text-xl font-bold">$58,500</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Override Commission</span>
                      <span className="text-xl font-bold">$31,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">Total Commission (YTD)</span>
                      <span className="text-2xl font-bold">$89,500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <CommissionCalculator
                agent={agentHierarchy}
                commissionRate={25}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            {isLoadingHierarchy ? (
              <Card>
                <CardContent className="p-6 flex justify-center">
                  <p>Loading team hierarchy...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <AgentHierarchyChart
                  data={agentHierarchy}
                  onAgentClick={handleAgentClick}
                />
                
                {selectedAgent && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Agent Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                              {selectedAgent.avatar ? (
                                <img 
                                  src={selectedAgent.avatar} 
                                  alt={selectedAgent.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-xl font-bold">
                                  {selectedAgent.name.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">{selectedAgent.name}</h3>
                              <p className="text-sm text-muted-foreground">{selectedAgent.rank}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{selectedAgent.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="font-medium">{selectedAgent.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Join Date</p>
                              <p className="font-medium">
                                {new Date(selectedAgent.joinDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Transactions</p>
                              <p className="font-medium">{selectedAgent.transactions}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 space-y-2">
                            <h4 className="font-medium">Commission</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-3 bg-muted rounded-lg text-center">
                                <p className="text-sm text-muted-foreground">Personal</p>
                                <p className="font-bold">
                                  ${selectedAgent.personalCommission.toLocaleString()}
                                </p>
                              </div>
                              <div className="p-3 bg-muted rounded-lg text-center">
                                <p className="text-sm text-muted-foreground">Override</p>
                                <p className="font-bold">
                                  ${selectedAgent.overrideCommission.toLocaleString()}
                                </p>
                              </div>
                              <div className="p-3 bg-muted rounded-lg text-center">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="font-bold">
                                  ${selectedAgent.totalCommission.toLocaleString()}
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
                                    Add a new agent under {selectedAgent.name}
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
                    
                    <CommissionCalculator
                      agent={selectedAgent}
                      commissionRate={25}
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Commission;
