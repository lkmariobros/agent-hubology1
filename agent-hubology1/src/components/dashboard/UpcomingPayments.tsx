
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarClock, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import useClerkUpcomingPayments from '@/hooks/useClerkUpcomingPayments';

interface UpcomingPaymentsProps {
  onViewAll?: () => void;
}

const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ onViewAll }) => {
  const navigate = useNavigate();
  const { data: upcomingPayments, isLoading } = useClerkUpcomingPayments();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/commissions/forecast');
    }
  };

  return (
    <Card className="h-full flex flex-col border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Upcoming Commission Payments
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs"
          onClick={handleViewAll}
        >
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
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
                    {payment.transaction?.property?.title || `Transaction #${payment.transaction_id.substring(0, 8)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.scheduled_date ? format(new Date(payment.scheduled_date), 'MMM dd, yyyy') : 'Date not set'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${payment.amount?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-muted-foreground">Installment {payment.installment_number}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <CalendarClock className="h-8 w-8 text-muted-foreground/60" />
            <p className="mt-2 text-sm text-muted-foreground">No upcoming payments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingPayments;
