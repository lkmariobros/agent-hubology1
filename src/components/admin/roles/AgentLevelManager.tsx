import React, { useState } from 'react';
import { useRoleHierarchy } from '@/hooks/useRoleHierarchy';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { RefreshCw, ChevronRight, Award, Zap, Edit, Check, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const AgentLevelManager: React.FC = () => {
  const { 
    roleLevels, 
    updateAgentLevel,
    isLoading, 
    refreshAll 
  } = useRoleHierarchy();
  
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentId, setAgentId] = useState('');
  const [salesAmount, setSalesAmount] = useState('');
  const [currentAgentLevel, setCurrentAgentLevel] = useState<string | null>(null);
  
  // Handle updating an agent's sales amount and level
  const handleUpdateAgentSales = async () => {
    if (!agentId.trim()) {
      toast.error('Please select an agent');
      return;
    }
    
    if (!salesAmount || isNaN(Number(salesAmount)) || Number(salesAmount) < 0) {
      toast.error('Please enter a valid sales amount');
      return;
    }
    
    try {
      // Convert to number and multiply by 1,000,000 (since we track in dollars, not millions)
      const totalSales = Math.round(Number(salesAmount) * 1000000);
      await updateAgentLevel(agentId, totalSales);
      toast.success('Agent sales and level updated successfully');
      
      // Reset form
      setSalesAmount('');
      setAgentId('');
    } catch (error) {
      console.error('Error updating agent level:', error);
      toast.error('Failed to update agent level');
    }
  };
  
  // Mock function to search for agents (would be replaced with actual API call)
  const searchAgents = (term: string) => {
    // This would be replaced with an actual API call
    console.log('Searching for agents with term:', term);
    
    // For now, just return some mock data
    return [
      { id: 'agent1', name: 'John Doe', level: 'junior_agent', sales: 2500000 },
      { id: 'agent2', name: 'Jane Smith', level: 'agent', sales: 8750000 },
      { id: 'agent3', name: 'Bob Johnson', level: 'senior_agent', sales: 20000000 },
    ];
  };
  
  // Get details about the next level for a current level
  const getNextLevelDetails = (currentLevel: string) => {
    if (!roleLevels.length) return null;
    
    const currentLevelIndex = roleLevels.findIndex(level => level.name === currentLevel);
    if (currentLevelIndex === -1 || currentLevelIndex >= roleLevels.length - 1) {
      return null; // No next level
    }
    
    return roleLevels[currentLevelIndex + 1];
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Level Management</CardTitle>
          <CardDescription>Loading agent level data...</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Agent Level Management</CardTitle>
              <CardDescription>Manage agent progression through sales tiers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={refreshAll}>
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Panel: Update Agent Level */}
            <div className="space-y-4">
              <h3 className="font-medium">Update Agent Sales</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="agent-search">Search Agent</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="agent-search"
                      placeholder="Search by name or email"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Button variant="secondary">Search</Button>
                  </div>
                </div>
                
                {searchTerm && (
                  <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                    {searchAgents(searchTerm).map(agent => (
                      <div 
                        key={agent.id}
                        className="flex justify-between items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                        onClick={() => {
                          setAgentId(agent.id);
                          setCurrentAgentLevel(agent.level);
                          setSalesAmount((agent.sales / 1000000).toString());
                          setSearchTerm('');
                        }}
                      >
                        <div>
                          <div>{agent.name}</div>
                          <div className="text-xs text-gray-500">
                            {roleLevels.find(l => l.name === agent.level)?.display_name || agent.level}
                          </div>
                        </div>
                        <div className="text-sm">{formatCurrency(agent.sales)}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {agentId && (
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Update Sales Amount</h4>
                      <div className="flex space-x-1">
                        {isEditing ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setIsEditing(false)}
                              className="h-8 w-8 text-green-600"
                            >
                              <Check size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setIsEditing(false)}
                              className="h-8 w-8 text-red-600"
                            >
                              <X size={16} />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsEditing(true)}
                            className="h-8 w-8"
                          >
                            <Edit size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sales-amount">Total Sales ($M)</Label>
                      <Input 
                        id="sales-amount"
                        type="number"
                        step="0.1"
                        min="0"
                        value={salesAmount}
                        onChange={e => setSalesAmount(e.target.value)}
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-gray-500">
                        Enter the total sales amount in millions (e.g., 5 for $5M)
                      </p>
                    </div>
                    
                    {currentAgentLevel && (
                      <div className="space-y-2">
                        <Label>Current Level</Label>
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-blue-500" />
                          <span>
                            {roleLevels.find(l => l.name === currentAgentLevel)?.display_name || currentAgentLevel}
                          </span>
                        </div>
                        
                        {getNextLevelDetails(currentAgentLevel) && (
                          <div className="pt-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Progress to next level</span>
                              <span>
                                {formatCurrency(Number(salesAmount) * 1000000)} / 
                                {formatCurrency(getNextLevelDetails(currentAgentLevel)?.min_sales_value || 0)}
                              </span>
                            </div>
                            <Progress 
                              value={Math.min(
                                (Number(salesAmount) * 1000000) / 
                                (getNextLevelDetails(currentAgentLevel)?.min_sales_value || 1) * 100, 
                                100
                              )} 
                              className="h-2 mt-1"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      className="w-full" 
                      onClick={handleUpdateAgentSales}
                      disabled={!isEditing}
                    >
                      Update Agent Sales
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Panel: Level Thresholds */}
            <div className="space-y-4">
              <h3 className="font-medium">Agent Level Thresholds</h3>
              <div className="border rounded-md divide-y">
                {roleLevels.map((level, index) => (
                  <div key={level.id} className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`
                          h-8 w-8 rounded-full flex items-center justify-center
                          ${index === 0 ? 'bg-blue-100 text-blue-600' : 
                            index === 1 ? 'bg-green-100 text-green-600' :
                            index === 2 ? 'bg-yellow-100 text-yellow-600' :
                            index === 3 ? 'bg-orange-100 text-orange-600' :
                            'bg-red-100 text-red-600'}
                        `}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{level.display_name}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(level.min_sales_value)}
                        </div>
                        {level.next_level_threshold && (
                          <div className="text-xs text-gray-500">
                            Next: {formatCurrency(level.next_level_threshold)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < roleLevels.length - 1 && (
                      <div className="mt-2 pl-4 flex items-center text-xs text-gray-500">
                        <ChevronRight className="h-4 w-4 mr-1" />
                        <span>
                          Need {formatCurrency(roleLevels[index + 1].min_sales_value - level.min_sales_value)} more in sales
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentLevelManager;