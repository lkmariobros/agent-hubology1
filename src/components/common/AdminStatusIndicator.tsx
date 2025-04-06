
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Shield, User, AlertCircle } from 'lucide-react';

/**
 * A simple component that shows the current admin status
 * This is for debugging purposes only
 */
const AdminStatusIndicator: React.FC = () => {
  const { user, isAdmin, activeRole, roles, loading, error } = useAuth();
  
  if (loading) {
    return <div className="text-xs p-2 bg-muted/50 rounded">Checking admin status...</div>;
  }
  
  if (error) {
    return (
      <div className="text-xs p-2 bg-destructive/10 text-destructive rounded flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Auth error: {error.message}
      </div>
    );
  }
  
  if (!user) {
    return <div className="text-xs p-2 bg-muted/50 rounded">Not logged in</div>;
  }
  
  return (
    <div className="text-xs p-2 bg-muted/10 rounded border border-border">
      <div className="flex items-center gap-2 mb-1">
        <User className="h-3 w-3 text-muted-foreground" />
        <span>{user.email}</span>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1">
        <Badge variant={isAdmin ? "default" : "outline"} className="text-[10px] h-5">
          {isAdmin ? (
            <><Shield className="h-3 w-3 mr-1" /> Admin: Yes</>
          ) : (
            <>Admin: No</>
          )}
        </Badge>
        
        <Badge variant="outline" className="text-[10px] h-5">
          Active Role: {activeRole}
        </Badge>
      </div>
      
      <div className="mt-1 text-[10px] text-muted-foreground">
        Available Roles: {roles.join(', ')}
      </div>
    </div>
  );
};

export default AdminStatusIndicator;
