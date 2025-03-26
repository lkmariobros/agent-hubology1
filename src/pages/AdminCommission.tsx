import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from '@/utils/propertyUtils';
import { AgentRank, RankRequirement } from '@/types';
import { useSystemConfiguration } from '@/hooks/useCommissionApproval';

const AdminCommission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRank, setSelectedRank] = useState<AgentRank>('Advisor');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRank, setEditRank] = useState<RankRequirement | null>(null);
  const [newRank, setNewRank] = useState<Omit<RankRequirement, 'rank' | 'description'>>({
    salesVolume: 0,
    transactions: 0,
    minTransactions: 0,
    minSalesVolume: 0,
    personalSales: 0,
    recruitedAgents: 0
  });
  
  const { threshold, isLoading } = useSystemConfiguration();
  const [commissionThreshold, setCommissionThreshold] = useState<number>(threshold || 10000);
  
  useEffect(() => {
    if (!isLoading && threshold !== null) {
      setCommissionThreshold(threshold);
    }
  }, [threshold, isLoading]);

  const rankRequirements: RankRequirement[] = [
    {
      rank: 'Advisor',
      salesVolume: 1000000,
      transactions: 5,
      description: 'Entry level position',
      minTransactions: 5,
      minSalesVolume: 1000000,
      personalSales: 3,
      recruitedAgents: 0
    },
    {
      rank: 'Sales Leader',
      salesVolume: 3000000,
      transactions: 15,
      description: 'Proven sales track record',
      minTransactions: 15,
      minSalesVolume: 3000000,
      personalSales: 8,
      recruitedAgents: 2
    },
    {
      rank: 'Team Leader',
      salesVolume: 7500000,
      transactions: 35,
      description: 'Leads and mentors a team',
      minTransactions: 35,
      minSalesVolume: 7500000,
      personalSales: 15,
      recruitedAgents: 5
    },
    {
      rank: 'Group Leader',
      salesVolume: 15000000,
      transactions: 75,
      description: 'Manages multiple teams',
      minTransactions: 75,
      minSalesVolume: 15000000,
      personalSales: 30,
      recruitedAgents: 10
    },
    {
      rank: 'Supreme Leader',
      salesVolume: 30000000,
      transactions: 150,
      description: 'Oversees entire sales division',
      minTransactions: 150,
      minSalesVolume: 30000000,
      personalSales: 60,
      recruitedAgents: 20
    },
  ];

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setCommissionThreshold(value);
  };
  
  const handleThresholdSave = () => {
    toast({
      title: 'Threshold saved',
      description: `Commission threshold has been updated to ${formatCurrency(commissionThreshold)}`,
    });
  };

  const handleRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRank({
      ...newRank,
      [e.target.name]: parseInt(e.target.value, 10),
    });
  };

  const handleCreateRank = () => {
    // Implement create rank logic here
    setIsDialogOpen(false);
    toast({
      title: 'Rank created',
      description: `New rank ${selectedRank} has been created`,
    });
  };

  const handleEditRank = (rank: RankRequirement) => {
    setEditRank(rank);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRank = () => {
    // Implement update rank logic here
    setIsEditDialogOpen(false);
    toast({
      title: 'Rank updated',
      description: `Rank ${editRank?.rank} has been updated`,
    });
  };

  const handleDeleteRank = (rank: RankRequirement) => {
    // Implement delete rank logic here
    toast({
      title: 'Rank deleted',
      description: `Rank ${rank.rank} has been deleted`,
    });
  };

  const RankCard = ({ rank }: { rank: RankRequirement }) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{rank.rank}</CardTitle>
          <CardDescription>{rank.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Transactions</p>
              <p className="font-medium">{rank.transactions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sales Volume</p>
              <p className="font-medium">{formatCurrency(rank.salesVolume)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Personal Sales</p>
              <p className="font-medium">{rank.personalSales || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Recruited Agents</p>
              <p className="font-medium">{rank.recruitedAgents || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">Commission Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission Threshold</CardTitle>
            <CardDescription>Set the threshold for commission amounts requiring approval.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Label htmlFor="threshold" className="text-right w-32">
                Approval Threshold:
              </Label>
              <Input
                id="threshold"
                type="number"
                placeholder="Enter amount"
                value={commissionThreshold}
                onChange={handleThresholdChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleThresholdSave}>Save Threshold</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Ranks</CardTitle>
            <CardDescription>Manage agent ranks and their requirements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of agent ranks and their requirements.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Sales Volume</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankRequirements.map((rank) => (
                  <TableRow key={rank.rank}>
                    <TableCell className="font-medium">{rank.rank}</TableCell>
                    <TableCell>{rank.transactions}</TableCell>
                    <TableCell>{formatCurrency(rank.salesVolume)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditRank(rank)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRank(rank)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rank
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Rank</DialogTitle>
                  <DialogDescription>
                    Create a new agent rank with specific requirements.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rank" className="text-right">
                      Rank
                    </Label>
                    <Select onValueChange={value => setSelectedRank(value as AgentRank)} defaultValue={selectedRank}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a rank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Advisor">Advisor</SelectItem>
                        <SelectItem value="Sales Leader">Sales Leader</SelectItem>
                        <SelectItem value="Team Leader">Team Leader</SelectItem>
                        <SelectItem value="Group Leader">Group Leader</SelectItem>
                        <SelectItem value="Supreme Leader">Supreme Leader</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="transactions" className="text-right">
                      Transactions
                    </Label>
                    <Input
                      type="number"
                      id="transactions"
                      name="transactions"
                      onChange={handleRankChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salesVolume" className="text-right">
                      Sales Volume
                    </Label>
                    <Input
                      type="number"
                      id="salesVolume"
                      name="salesVolume"
                      onChange={handleRankChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" onClick={handleCreateRank}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      {/* Edit Rank Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Rank</DialogTitle>
            <DialogDescription>
              Edit the requirements for the {editRank?.rank} agent rank.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-transactions" className="text-right">
                Transactions
              </Label>
              <Input
                type="number"
                id="edit-transactions"
                defaultValue={editRank?.transactions}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-salesVolume" className="text-right">
                Sales Volume
              </Label>
              <Input
                type="number"
                id="edit-salesVolume"
                defaultValue={editRank?.salesVolume}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateRank}>
              Update Rank
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommission;
