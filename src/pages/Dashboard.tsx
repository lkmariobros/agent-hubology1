
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import MetricsContainer from '@/components/dashboard/MetricsContainer';
import OpportunitiesBoard from '@/components/dashboard/OpportunitiesBoard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PropertyShowcase from '@/components/dashboard/PropertyShowcase';
import RoleDebugInfo from '@/components/auth/RoleDebugInfo';
import { useMetrics } from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Building2, Users, DollarSign, LineChart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: metricsData } = useMetrics();
  const navigate = useNavigate();

  // Transform metrics data from API into the format needed by MetricsContainer
  const metrics = React.useMemo(() => {
    if (!metricsData?.data?.metrics) return [];
    
    // Map API metrics to component props with proper icons
    return metricsData.data.metrics.map((metric, index) => {
      // Create proper icon components based on the icon string
      let icon = null;
      switch (metric.icon) {
        case 'building':
          icon = <Building2 className="h-5 w-5" />;
          break;
        case 'users':
          icon = <Users className="h-5 w-5" />;
          break;
        case 'dollar':
          icon = <DollarSign className="h-5 w-5" />;
          break;
        case 'chart':
          icon = <LineChart className="h-5 w-5" />;
          break;
      }
      
      return {
        ...metric,
        id: String(index), // Ensure we have an id for each metric
        icon: icon
      };
    });
  }, [metricsData]);

  // Handler for "View All Opportunities" button
  const handleViewAllOpportunities = () => {
    navigate('/opportunities');
  };

  return (
    <div className="space-y-6 p-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Agent'}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your properties and transactions.
        </p>
      </div>

      {/* Dashboard Metrics */}
      <ErrorBoundary>
        <MetricsContainer metrics={metrics} />
      </ErrorBoundary>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <OpportunitiesBoard onViewAll={handleViewAllOpportunities} />
          </ErrorBoundary>
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>

      {/* Property Showcase */}
      <PropertyShowcase />
      
      {/* Debug information at the bottom of the page */}
      <div className="flex justify-end mt-8">
        <RoleDebugInfo />
      </div>
    </div>
  );
};

export default Dashboard;
