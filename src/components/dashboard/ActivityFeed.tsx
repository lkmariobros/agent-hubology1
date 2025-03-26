
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Check, X, User, Home, DollarSign } from 'lucide-react';
import { formatDate } from '@/utils/propertyUtils';
import { useNavigate } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: 'transaction' | 'property' | 'commission' | 'client' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'cancelled';
  relatedId?: string;
}

interface ActivityFeedProps {
  limit?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 5 }) => {
  const navigate = useNavigate();
  
  // Sample activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'transaction',
      title: 'New transaction created',
      description: 'Luxury Condo in Downtown',
      timestamp: '2023-06-10T10:30:00',
      status: 'pending',
      relatedId: '101'
    },
    {
      id: '2',
      type: 'commission',
      title: 'Commission approved',
      description: '$5,250 from Hillside Villa sale',
      timestamp: '2023-06-09T15:45:00',
      status: 'completed',
      relatedId: '202'
    },
    {
      id: '3',
      type: 'property',
      title: 'New property listing',
      description: 'Beach House with Ocean View',
      timestamp: '2023-06-08T09:15:00',
      status: 'pending',
      relatedId: '303'
    },
    {
      id: '4',
      type: 'client',
      title: 'Client meeting scheduled',
      description: 'Property viewing with John Doe',
      timestamp: '2023-06-07T14:00:00',
      status: 'pending',
      relatedId: '404'
    },
    {
      id: '5',
      type: 'system',
      title: 'System update completed',
      description: 'New features added to platform',
      timestamp: '2023-06-06T16:30:00',
      status: 'completed'
    }
  ];
  
  // Limit the number of activities to display
  const limitedActivities = activities.slice(0, limit);
  
  // Get icon based on activity type
  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'property':
        return <Home className="h-4 w-4 text-green-500" />;
      case 'commission':
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'client':
        return <User className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'cancelled':
        return <X className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Handle activity click
  const handleActivityClick = (activity: ActivityItem) => {
    if (!activity.relatedId) return;
    
    switch (activity.type) {
      case 'transaction':
        navigate(`/transactions/${activity.relatedId}`);
        break;
      case 'property':
        navigate(`/properties/${activity.relatedId}`);
        break;
      case 'commission':
        navigate(`/commission?id=${activity.relatedId}`);
        break;
      case 'client':
        navigate(`/clients/${activity.relatedId}`);
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="space-y-4">
      {limitedActivities.length > 0 ? (
        <>
          {limitedActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => activity.relatedId && handleActivityClick(activity)}
              className={`flex items-start space-x-3 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors ${activity.relatedId ? 'cursor-pointer' : ''}`}
            >
              <div className="h-8 w-8 rounded-full bg-muted/70 flex items-center justify-center mt-0.5">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  {activity.status && (
                    <Badge 
                      variant="outline" 
                      className="ml-2 px-1.5 h-5 text-[10px] flex items-center gap-1"
                    >
                      {getStatusIcon(activity.status)}
                      <span>{activity.status}</span>
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{activity.description}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
          ))}
          
          {activities.length > limit && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs text-muted-foreground"
              onClick={() => navigate('/activities')}
            >
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-3">
          No recent activity found
        </p>
      )}
    </div>
  );
};

export default ActivityFeed;
