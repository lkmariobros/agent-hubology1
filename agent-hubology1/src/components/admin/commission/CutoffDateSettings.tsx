
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

const CUTOFF_DATE_KEY = 'commission_payment_cutoff_day';

export function CutoffDateSettings() {
  const [cutoffDay, setCutoffDay] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch the current cutoff day setting from system_configuration
  const { data, isLoading } = useQuery({
    queryKey: ['systemConfig', CUTOFF_DATE_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('value, description')
        .eq('key', CUTOFF_DATE_KEY)
        .single();
      
      if (error) {
        // If not found, it's not an error - we'll create it
        if (error.code === 'PGRST116') {
          return { value: '26', description: 'Day of month for commission payment processing cutoff' };
        }
        throw error;
      }
      
      return data;
    }
  });
  
  // Update cutoff day in the system_configuration table
  const updateCutoffDay = useMutation({
    mutationFn: async (newValue: string) => {
      // Check if the setting exists
      const { count } = await supabase
        .from('system_configuration')
        .select('*', { count: 'exact', head: true })
        .eq('key', CUTOFF_DATE_KEY);
      
      if (count === 0) {
        // Insert if it doesn't exist
        const { error } = await supabase
          .from('system_configuration')
          .insert({
            key: CUTOFF_DATE_KEY,
            value: newValue,
            description: 'Day of month for commission payment processing cutoff',
            updated_by: (await supabase.auth.getUser()).data.user?.id
          });
        
        if (error) throw error;
      } else {
        // Update if it exists
        const { error } = await supabase
          .from('system_configuration')
          .update({
            value: newValue,
            updated_by: (await supabase.auth.getUser()).data.user?.id,
            updated_at: new Date().toISOString()
          })
          .eq('key', CUTOFF_DATE_KEY);
        
        if (error) throw error;
      }
      
      return newValue;
    },
    onSuccess: () => {
      toast.success('Payment cutoff day updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['systemConfig', CUTOFF_DATE_KEY] });
    },
    onError: (error) => {
      toast.error(`Failed to update payment cutoff day: ${error.message}`);
    }
  });
  
  // Handle edit start
  const handleEditStart = () => {
    setIsEditing(true);
    setCutoffDay(data?.value || '26');
  };
  
  // Handle save
  const handleSave = () => {
    const dayNumber = parseInt(cutoffDay, 10);
    
    // Validate input
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
      toast.error('Please enter a valid day (1-31)');
      return;
    }
    
    updateCutoffDay.mutate(cutoffDay);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setCutoffDay(data?.value || '26');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Cutoff Settings</CardTitle>
        <CardDescription>
          Configure the day of the month when commission payments are processed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cutoffDay">Payment Cutoff Day</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cutoffDay"
                  value={cutoffDay}
                  onChange={(e) => setCutoffDay(e.target.value)}
                  type="number"
                  min="1"
                  max="31"
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">of each month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Installments due after this day will be processed in the following month's payment cycle
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} disabled={updateCutoffDay.isPending}>
                {updateCutoffDay.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Payment Cutoff Day</h3>
                  <p className="text-sm text-muted-foreground">
                    Installments due after this day will be processed in the following month's payment cycle
                  </p>
                </div>
                <div className="text-3xl font-bold">{data?.value || '26'}</div>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleEditStart}>
              Edit Configuration
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CutoffDateSettings;
