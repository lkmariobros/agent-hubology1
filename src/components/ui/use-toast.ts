
// Re-export from sonner for backward compatibility
import { toast } from 'sonner';

export { toast };

// For compatibility with existing code that uses useToast
export const useToast = () => {
  return {
    toast,
    // For compatibility with shadcn/ui toast API
    toasts: []
  };
};

export default toast;
