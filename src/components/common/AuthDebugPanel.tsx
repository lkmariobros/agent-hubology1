
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';
import { useState } from 'react';

/**
 * Debug component that displays authentication state
 * Only visible in development mode
 */
const AuthDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading, error, roles, activeRole } = useAuth();
  
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-slate-800 rounded-lg shadow-lg border border-slate-700 text-white overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center justify-between w-full p-3">
            <div className="flex items-center">
              <Bug size={18} className="mr-2" />
              <span className="font-mono text-xs font-medium">
                Auth Debug {loading ? '(Loading...)' : isAuthenticated ? '(Authenticated)' : '(Not Authenticated)'}
              </span>
            </div>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-3 text-xs font-mono overflow-auto max-h-[400px]">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : error ? (
              <div className="text-red-400">
                <div>Error: {error.message}</div>
                <pre className="mt-2 p-2 bg-slate-900 rounded whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <span className="text-slate-400">User ID:</span> {user?.id || 'null'}
                </div>
                <div className="mb-2">
                  <span className="text-slate-400">Email:</span> {user?.email || 'null'}
                </div>
                <div className="mb-2">
                  <span className="text-slate-400">Name:</span> {user?.full_name || 'null'}
                </div>
                <div className="mb-2">
                  <span className="text-slate-400">Roles:</span> {roles.join(', ') || 'none'}
                </div>
                <div className="mb-2">
                  <span className="text-slate-400">Active Role:</span> {activeRole || 'none'}
                </div>
                <div className="mb-2">
                  <span className="text-slate-400">Is Admin:</span> {roles.includes('admin') ? 'true' : 'false'}
                </div>
                <div className="mt-4 pt-2 border-t border-slate-700">
                  <span className="text-slate-400">Session Info:</span> 
                  <pre className="mt-1 p-2 bg-slate-900 rounded whitespace-pre-wrap overflow-auto max-h-[200px]">
                    {JSON.stringify({
                      isAuthenticated,
                      user: user || null,
                    }, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AuthDebugPanel;
