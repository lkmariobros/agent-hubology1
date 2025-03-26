
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, Edit, Trash2, Download, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const CommissionTiers = () => {
  // Sample tier data
  const tiers = [
    { id: 1, name: 'Junior Agent', commissionRate: 70, saleRequirement: 5000000, agents: 32 },
    { id: 2, name: 'Agent', commissionRate: 75, saleRequirement: 15000000, agents: 24 },
    { id: 3, name: 'Senior Agent', commissionRate: 80, saleRequirement: 45000000, agents: 15 },
    { id: 4, name: 'Associate Director', commissionRate: 85, saleRequirement: 100000000, agents: 7 },
    { id: 5, name: 'Director', commissionRate: 90, saleRequirement: null, agents: 3 },
  ];

  const [showReportsDialog, setShowReportsDialog] = useState(false);

  // Mock function for generating reports - would be connected to real API in production
  const generateReport = (reportType: string) => {
    toast.success(`Generating ${reportType} report`, {
      description: "Your report will be ready shortly and available for download.",
    });
    
    // Close the dialog
    setShowReportsDialog(false);
    
    // In a real implementation, this would trigger an API call to generate the report
    setTimeout(() => {
      toast.success(`${reportType} report is ready`, {
        description: "Your report has been generated and is ready for download.",
        action: {
          label: "Download",
          onClick: () => console.log(`Downloading ${reportType} report...`)
        }
      });
    }, 2500);
  };

  return (
    <div className="space-y-6 px-[44px] py-[36px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commission Tiers</h1>
          <p className="text-muted-foreground">
            Manage agent progression tiers and commission rates.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showReportsDialog} onOpenChange={setShowReportsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileText size={16} />
                Commission Reports
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Commission Reports</DialogTitle>
                <DialogDescription>
                  Select a report type to generate commission-related reports.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => generateReport("Commission by Tier")}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Commission by Tier</span>
                    <span className="text-xs text-muted-foreground">Summary of commission distribution across agent tiers</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => generateReport("Agent Performance")}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Agent Performance Report</span>
                    <span className="text-xs text-muted-foreground">Commission earnings by agent with performance metrics</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => generateReport("Monthly Commission Summary")}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Monthly Commission Summary</span>
                    <span className="text-xs text-muted-foreground">Overview of commissions for the current month</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => generateReport("Commission Projection")}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Commission Projection</span>
                    <span className="text-xs text-muted-foreground">Forecast of expected commissions based on pipeline</span>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button className="gap-2">
            <Plus size={16} />
            Add New Tier
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Commission Structure
          </CardTitle>
          <CardDescription>
            Configure commission rates and requirements for each agent tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tier Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Commission Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sales Requirement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Agents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Distribution</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {tiers.map((tier) => (
                  <tr key={tier.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tier.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{tier.commissionRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {tier.saleRequirement ? `$${(tier.saleRequirement / 1000000).toFixed(1)}M` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{tier.agents}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24">
                        <Progress value={tier.agents * 100 / 81} className="h-2" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              Edit Tier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => generateReport(`${tier.name} Tier Report`)}
                            >
                              Generate Tier Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionTiers;
