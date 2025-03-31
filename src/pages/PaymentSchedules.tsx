
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import useCommissionSchedules from '@/hooks/useCommissionSchedules';
import PaymentScheduleCard from '@/components/commission/schedules/PaymentScheduleCard';
import { Skeleton } from '@/components/ui/skeleton';
import useAuth from '@/hooks/useAuth';

const PaymentSchedules = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { useAgentPaymentSchedules } = useCommissionSchedules();
  const { data: schedules, isLoading } = useAgentPaymentSchedules(user?.id);
  
  // Filter schedules based on tab and search query
  const filteredSchedules = schedules?.filter(schedule => {
    // Filter by status
    if (currentTab === 'active' && schedule.status !== 'Active') return false;
    if (currentTab === 'completed' && schedule.status !== 'Completed') return false;
    if (currentTab === 'cancelled' && schedule.status !== 'Cancelled') return false;
    
    // Filter by search query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const hasMatch = 
        schedule.id.toLowerCase().includes(query) ||
        schedule.commission_approval_id.toLowerCase().includes(query) ||
        schedule.total_amount.toString().includes(query);
      
      if (!hasMatch) return false;
    }
    
    return true;
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in the filter logic above
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Payment Schedules</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search schedules..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" type="button">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !filteredSchedules || filteredSchedules.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-bold mb-2">No Schedules Found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery 
                  ? "No payment schedules match your search criteria. Try a different search term or filter."
                  : currentTab === 'active' 
                    ? "You don't have any active payment schedules."
                    : currentTab === 'completed'
                      ? "You don't have any completed payment schedules."
                      : "You don't have any cancelled payment schedules."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchedules.map(schedule => (
            <PaymentScheduleCard 
              key={schedule.id} 
              schedule={schedule}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentSchedules;
