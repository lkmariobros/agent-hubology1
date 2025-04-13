import React from 'react';
import { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface ProfilePreferencesProps {
  profileData: any;
  updateProfileData: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const ProfilePreferences: React.FC<ProfilePreferencesProps> = ({ 
  profileData, 
  updateProfileData, 
  onNext, 
  onBack,
  isLoading
}) => {
  // Handle preference changes
  const handleSwitchChange = (name: string) => (checked: boolean) => {
    updateProfileData({ [name]: checked });
  };
  
  // Handle sales target change
  const handleSalesTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    updateProfileData({ salesTarget: value });
  };
  
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Preferences</CardTitle>
        <CardDescription className="text-gray-400">
          Set your preferences to personalize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark mode preference */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">Dark Mode</Label>
            <p className="text-gray-400 text-sm">Use dark mode for the interface</p>
          </div>
          <Switch 
            checked={profileData.darkMode} 
            onCheckedChange={handleSwitchChange('darkMode')}
          />
        </div>
        
        {/* Email notifications preference */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">Email Notifications</Label>
            <p className="text-gray-400 text-sm">Receive updates via email</p>
          </div>
          <Switch 
            checked={profileData.emailNotifications} 
            onCheckedChange={handleSwitchChange('emailNotifications')}
          />
        </div>
        
        {/* Sales target - only for agent roles */}
        {profileData.role === 'agent' && (
          <div className="space-y-2">
            <Label htmlFor="salesTarget" className="text-white font-medium">Annual Sales Target ($M)</Label>
            <p className="text-gray-400 text-sm mb-2">Set your annual sales target in millions</p>
            <Input
              id="salesTarget"
              type="number"
              value={profileData.salesTarget || ''}
              onChange={handleSalesTargetChange}
              className="bg-gray-800 text-white border-gray-700"
              placeholder="Enter target (e.g., 15)"
              min="0"
              step="1"
            />
          </div>
        )}
        
        {/* Preferred portal selection */}
        <div className="space-y-2">
          <Label className="text-white font-medium">Default Portal</Label>
          <p className="text-gray-400 text-sm mb-2">Choose which portal to show by default when you log in</p>
          <div className="flex gap-3">
            <Button
              type="button"
              className={profileData.preferredPortal === 'agent' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}
              onClick={() => updateProfileData({ preferredPortal: 'agent' })}
            >
              Agent Portal
            </Button>
            {(profileData.role === 'admin' || profileData.role === 'manager') && (
              <Button
                type="button"
                className={profileData.preferredPortal === 'admin' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}
                onClick={() => updateProfileData({ preferredPortal: 'admin' })}
              >
                Admin Portal
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Creating Profile...
            </>
          ) : 'Complete Setup'}
        </Button>
      </CardFooter>
    </>
  );
};

export default ProfilePreferences;