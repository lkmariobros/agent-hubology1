
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import useCommissionSchedules from '@/hooks/useCommissionSchedules';
import PaymentScheduleCard from './PaymentScheduleCard';
import { useNavigate } from 'react-router-dom';

interface PaymentScheduleListProps {
  agentId?: string;
  limit?: number;
  showViewAll?: boolean;
}

const PaymentScheduleList: React.FC<PaymentScheduleListProps> = ({
  agentId,
  limit = 3,
  showViewAll = true
}) => {
  const navigate = useNavigate();
  const { useAgentPaymentSchedules } = useCommissionSchedules();
  const { data: schedules, isLoading } = useAgentPaymentSchedules(agentId);
  
  // Filter to active schedules only and limit
  const activeSchedules = schedules?.filter(s => s.status === 'Active').slice(0, limit);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!activeSchedules || activeSchedules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No active payment schedules
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Schedules</CardTitle>
        
        {showViewAll && schedules && schedules.length > limit && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-accent hover:text-accent/80"
            onClick={() => navigate('/schedules')}
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {activeSchedules.map((schedule) => (
          <PaymentScheduleCard 
            key={schedule.id} 
            schedule={schedule} 
            showActions={false}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleList;
