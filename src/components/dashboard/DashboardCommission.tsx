
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ArrowRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/propertyUtils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CommissionApprovalStatus from '@/components/commission/CommissionApprovalStatus';

interface DashboardCommissionProps {
  commissionData?: {
    currentMonth: number;
    lastMonth: number;
    trend: number;
    projected: number;
  };
}

const DashboardCommission: React.FC<DashboardCommissionProps> = ({ 
  commissionData = {
    currentMonth: 25000,
    lastMonth: 21500,
    trend: 16.3,
    projected: 32000
  }
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Commission Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <p className="text-sm text-muted-foreground">Current Month</p>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-bold">{formatCurrency(commissionData.currentMonth)}</h2>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${commissionData.trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm ${commissionData.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {commissionData.trend >= 0 ? '+' : ''}{commissionData.trend}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs. {formatCurrency(commissionData.lastMonth)} last month</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Projected This Month</p>
                <h3 className="text-xl font-bold">{formatCurrency(commissionData.projected)}</h3>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link to="/commission">
                View Commission Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <CommissionApprovalStatus limit={3} />
      </div>
    </div>
  );
};

export default DashboardCommission;
