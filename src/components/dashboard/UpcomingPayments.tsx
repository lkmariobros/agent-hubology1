
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarClock, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/commissionSchedule';
import { format, parseISO } from 'date-fns';

// We'll implement this hook in the next step
import { useUpcomingPayments } from '@/hooks/useUpcomingPayments';

const UpcomingPayments: React.FC = () => {
  const navigate = useNavigate();
  const { data: upcomingPayments, isLoading } = useUpcomingPayments();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Upcoming Commission Payments
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-xs" 
          onClick={() => navigate('/commissions/forecast')}
        >
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="h-9 w-9 rounded-md" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingPayments?.length ? (
          <div className="space-y-3">
            {upcomingPayments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-md p-2">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {payment.transaction?.property?.title || `Transaction #${payment.transactionId.substring(0, 8)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.scheduledDate ? format(parseISO(payment.scheduledDate), 'MMM dd, yyyy') : 'Date not set'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-muted-foreground">Installment {payment.installmentNumber}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-2 text-sm text-muted-foreground">No upcoming payments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingPayments;
