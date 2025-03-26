
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AgentRank, RankRequirement } from '@/types';

// Define form schema for rank configuration
const rankSchema = z.object({
  minTransactions: z.coerce.number().min(0, 'Must be at least 0'),
  minSalesVolume: z.coerce.number().min(0, 'Must be at least 0'),
  personalSales: z.boolean(),
  recruitedAgents: z.coerce.number().min(0, 'Must be at least 0').optional(),
  overridePercentage: z.coerce.number().min(0, 'Must be at least 0').max(100, 'Cannot exceed 100%'),
});

// Sample rank requirements data (in production, this would come from an API)
const initialRankRequirements: Record<AgentRank, RankRequirement> = {
  'Advisor': {
    rank: 'Advisor',
    minTransactions: 0,
    minSalesVolume: 0,
    personalSales: true,
    color: 'blue'
  },
  'Sales Leader': {
    rank: 'Sales Leader',
    minTransactions: 10,
    minSalesVolume: 5000000,
    personalSales: true,
    recruitedAgents: 2,
    color: 'purple'
  },
  'Team Leader': {
    rank: 'Team Leader',
    minTransactions: 25,
    minSalesVolume: 15000000,
    personalSales: true,
    recruitedAgents: 5,
    color: 'pink'
  },
  'Group Leader': {
    rank: 'Group Leader',
    minTransactions: 50,
    minSalesVolume: 50000000,
    personalSales: true,
    recruitedAgents: 10,
    color: 'orange'
  },
  'Supreme Leader': {
    rank: 'Supreme Leader',
    minTransactions: 100,
    minSalesVolume: 100000000,
    personalSales: true,
    recruitedAgents: 20,
    color: 'green'
  }
};

// Sample override percentage data (in production, this would come from an API)
const initialOverridePercentages: Record<AgentRank, number> = {
  'Advisor': 0,
  'Sales Leader': 7,
  'Team Leader': 5,
  'Group Leader': 8,
  'Supreme Leader': 6
};

const AdminCommission = () => {
  const [selectedRank, setSelectedRank] = useState<AgentRank>('Advisor');
  const [rankRequirements, setRankRequirements] = useState<Record<AgentRank, RankRequirement>>(initialRankRequirements);
  const [overridePercentages, setOverridePercentages] = useState<Record<AgentRank, number>>(initialOverridePercentages);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof rankSchema>>({
    resolver: zodResolver(rankSchema),
    defaultValues: {
      minTransactions: rankRequirements[selectedRank].minTransactions,
      minSalesVolume: rankRequirements[selectedRank].minSalesVolume,
      personalSales: rankRequirements[selectedRank].personalSales,
      recruitedAgents: rankRequirements[selectedRank].recruitedAgents,
      overridePercentage: overridePercentages[selectedRank]
    }
  });

  // Update form values when selected rank changes
  React.useEffect(() => {
    form.reset({
      minTransactions: rankRequirements[selectedRank].minTransactions,
      minSalesVolume: rankRequirements[selectedRank].minSalesVolume,
      personalSales: rankRequirements[selectedRank].personalSales,
      recruitedAgents: rankRequirements[selectedRank].recruitedAgents,
      overridePercentage: overridePercentages[selectedRank]
    });
  }, [selectedRank, rankRequirements, overridePercentages, form]);

  const onSubmit = (values: z.infer<typeof rankSchema>) => {
    // Update rank requirements
    setRankRequirements(prev => ({
      ...prev,
      [selectedRank]: {
        ...prev[selectedRank],
        minTransactions: values.minTransactions,
        minSalesVolume: values.minSalesVolume,
        personalSales: values.personalSales,
        recruitedAgents: values.recruitedAgents
      }
    }));

    // Update override percentages
    setOverridePercentages(prev => ({
      ...prev,
      [selectedRank]: values.overridePercentage
    }));

    toast({
      title: "Settings saved",
      description: `${selectedRank} commission settings have been updated.`,
    });
  };

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commission Configuration</h1>
          <p className="text-muted-foreground">
            Configure commission rates, tiers, and requirements for agent ranks.
          </p>
        </div>

        <Tabs defaultValue="ranks">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ranks">Rank Requirements</TabsTrigger>
            <TabsTrigger value="commission">Commission Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ranks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rank Requirements</CardTitle>
                <CardDescription>
                  Configure the requirements for each agent rank in the hierarchy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(rankRequirements).map((rank) => (
                    <Button
                      key={rank}
                      variant={selectedRank === rank ? "default" : "outline"}
                      onClick={() => setSelectedRank(rank as AgentRank)}
                    >
                      {rank}
                    </Button>
                  ))}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="minTransactions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Transactions</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum number of completed transactions required for this rank.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="minSalesVolume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Sales Volume</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={100000}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum sales volume required ({formatCurrency(form.watch("minSalesVolume"))})
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="personalSales"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Personal Sales Required</FormLabel>
                              <FormDescription>
                                Agent must make personal sales to qualify for this rank.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedRank !== 'Advisor' && (
                        <FormField
                          control={form.control}
                          name="recruitedAgents"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Recruited Agents</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Minimum number of agents that must be recruited.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="overridePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Override Commission Percentage: {field.value}%</FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={20}
                              step={0.5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <FormDescription>
                            The percentage of commission this rank earns from downline agents.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rank Summary</CardTitle>
                <CardDescription>
                  Overview of all rank requirements and commission rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-3 text-left font-medium text-muted-foreground">Rank</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Min. Transactions</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Min. Sales Volume</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Min. Recruits</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Override %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(rankRequirements).map(([rank, requirements]) => (
                        <tr key={rank} className="border-t hover:bg-muted/50">
                          <td className="p-3 font-medium">{rank}</td>
                          <td className="p-3">{requirements.minTransactions}</td>
                          <td className="p-3">{formatCurrency(requirements.minSalesVolume)}</td>
                          <td className="p-3">{requirements.recruitedAgents || 'N/A'}</td>
                          <td className="p-3">{overridePercentages[rank as AgentRank]}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="commission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Flow Visualization</CardTitle>
                <CardDescription>
                  This diagram shows how commission flows through the agent hierarchy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 flex flex-col items-center space-y-6">
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-muted max-w-sm w-full text-center">
                    <p className="font-semibold">Transaction</p>
                    <p className="text-2xl font-bold">${(1000000).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Base Commission: 3%</p>
                    <p className="text-lg font-bold">${(30000).toLocaleString()}</p>
                  </div>
                  
                  <div className="w-px h-8 bg-border"></div>
                  
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-property-blue/50 bg-property-blue/10 max-w-sm w-full text-center">
                    <p className="font-semibold">Advisor</p>
                    <p className="text-sm text-muted-foreground">100% of base commission</p>
                    <p className="text-lg font-bold">${(30000).toLocaleString()}</p>
                  </div>
                  
                  <div className="w-px h-8 bg-border"></div>
                  
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-property-purple/50 bg-property-purple/10 max-w-sm w-full text-center">
                    <p className="font-semibold">Sales Leader</p>
                    <p className="text-sm text-muted-foreground">{overridePercentages['Sales Leader']}% override</p>
                    <p className="text-lg font-bold">${(30000 * overridePercentages['Sales Leader'] / 100).toLocaleString()}</p>
                  </div>
                  
                  <div className="w-px h-8 bg-border"></div>
                  
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-property-pink/50 bg-property-pink/10 max-w-sm w-full text-center">
                    <p className="font-semibold">Team Leader</p>
                    <p className="text-sm text-muted-foreground">{overridePercentages['Team Leader']}% override</p>
                    <p className="text-lg font-bold">${(30000 * overridePercentages['Team Leader'] / 100).toLocaleString()}</p>
                  </div>
                  
                  <div className="w-px h-8 bg-border"></div>
                  
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-property-orange/50 bg-property-orange/10 max-w-sm w-full text-center">
                    <p className="font-semibold">Group Leader</p>
                    <p className="text-sm text-muted-foreground">{overridePercentages['Group Leader']}% override</p>
                    <p className="text-lg font-bold">${(30000 * overridePercentages['Group Leader'] / 100).toLocaleString()}</p>
                  </div>
                  
                  <div className="w-px h-8 bg-border"></div>
                  
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-property-green/50 bg-property-green/10 max-w-sm w-full text-center">
                    <p className="font-semibold">Supreme Leader</p>
                    <p className="text-sm text-muted-foreground">{overridePercentages['Supreme Leader']}% override</p>
                    <p className="text-lg font-bold">${(30000 * overridePercentages['Supreme Leader'] / 100).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Commission Rules</CardTitle>
                <CardDescription>
                  Customize the rules for how commission is distributed through the hierarchy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="override-limit" className="flex-grow">
                      Maximum Override Generations
                      <p className="text-sm text-muted-foreground mt-1">
                        How many levels up the hierarchy can override commissions flow.
                      </p>
                    </Label>
                    <Input
                      id="override-limit"
                      type="number"
                      className="w-20"
                      defaultValue={5}
                      min={1}
                      max={10}
                    />
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Switch id="rank-requirement" />
                    <Label htmlFor="rank-requirement" className="flex-grow">
                      Enforce Rank Superiority Rule
                      <p className="text-sm text-muted-foreground mt-1">
                        Upline agents can only earn override from downline agents of lower rank.
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Switch id="decrease-override" defaultChecked />
                    <Label htmlFor="decrease-override" className="flex-grow">
                      Decrease Override for Distant Generations
                      <p className="text-sm text-muted-foreground mt-1">
                        Override percentage decreases the further away the agent is in the hierarchy.
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Rules</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminCommission;
