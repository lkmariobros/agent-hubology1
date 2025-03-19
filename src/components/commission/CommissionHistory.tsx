
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CommissionHistory } from '@/types';

interface CommissionHistoryTableProps {
  commissions: CommissionHistory[];
  isLoading?: boolean;
}

const CommissionHistoryTable: React.FC<CommissionHistoryTableProps> = ({ 
  commissions, 
  isLoading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [commissionType, setCommissionType] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  
  // Filter commissions based on search, type and period
  const filteredCommissions = commissions.filter(commission => {
    // Filter by search query
    const matchesSearch = 
      commission.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.property.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by commission type
    const matchesType = 
      commissionType === 'all' || 
      commission.type === commissionType;
      
    // Filter by period (would need actual date filtering logic)
    const matchesPeriod = selectedPeriod === 'all'; // Placeholder
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const handleExport = () => {
    // Implement CSV export functionality
    const headers = ['Date', 'Property', 'Location', 'Amount', 'Type', 'Source'];
    
    const csvContent = [
      headers.join(','),
      ...filteredCommissions.map(commission => [
        new Date(commission.date).toLocaleDateString(),
        `"${commission.property.title}"`,
        `"${commission.property.location}"`,
        commission.amount,
        commission.type,
        commission.source || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `commission_history_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Commission History</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by property or location..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={commissionType} onValueChange={setCommissionType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="override">Override</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : filteredCommissions.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">No commission history found.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Property</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="border-t hover:bg-muted/50">
                      <td className="p-3">{new Date(commission.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{commission.property.title}</div>
                          <div className="text-sm text-muted-foreground">{commission.property.location}</div>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{formatCurrency(commission.amount)}</td>
                      <td className="p-3">
                        <Badge variant={commission.type === 'personal' ? 'default' : 'outline'}>
                          {commission.type === 'personal' ? 'Personal' : 'Override'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {commission.source ? commission.source : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CommissionHistoryComponent: React.FC<CommissionHistoryTableProps> = ({ commissions, isLoading }) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All Commissions</TabsTrigger>
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="override">Override</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <CommissionHistoryTable 
          commissions={commissions} 
          isLoading={isLoading} 
        />
      </TabsContent>
      <TabsContent value="personal">
        <CommissionHistoryTable 
          commissions={commissions.filter(c => c.type === 'personal')} 
          isLoading={isLoading} 
        />
      </TabsContent>
      <TabsContent value="override">
        <CommissionHistoryTable 
          commissions={commissions.filter(c => c.type === 'override')} 
          isLoading={isLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default CommissionHistoryComponent;
