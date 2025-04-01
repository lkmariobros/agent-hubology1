import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommissionPaymentSchedule } from '@/types/commission';
import { formatDate } from '@/lib/utils';

export interface PaymentScheduleCardProps {
  schedule: CommissionPaymentSchedule;
  showActions?: boolean;  // Add this property
}

const PaymentScheduleCard: React.FC<PaymentScheduleCardProps> = ({ 
  schedule,
  showActions = true
}) => {
  return (
    <Card>
      <CardContent className="flex items-start justify-between space-y-2">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">{schedule.transaction_id}</h3>
          <p className="text-sm text-muted-foreground">
            Created: {formatDate(schedule.created_at)}
          </p>
          <p className="text-sm text-muted-foreground">
            Total Amount: ${schedule.total_amount}
          </p>
          <p className="text-sm text-muted-foreground">
            Remaining Amount: ${schedule.remaining_amount}
          </p>
          <Badge variant="secondary">{schedule.status}</Badge>
        </div>
        
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" /> <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" /> <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleCard;
