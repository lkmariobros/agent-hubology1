import React from 'react';
import { CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileBasicInfoProps {
  profileData: any;
  updateProfileData: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProfileBasicInfo: React.FC<ProfileBasicInfoProps> = ({ 
  profileData, 
  updateProfileData, 
  onNext, 
  onBack 
}) => {
  // These are pre-filled from Clerk so we're just displaying them
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 mb-4">
          This information is synced from your login provider.
        </p>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">First Name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => updateProfileData({ firstName: e.target.value })}
              className="bg-gray-800 text-white border-gray-700"
              placeholder="First Name"
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => updateProfileData({ lastName: e.target.value })}
              className="bg-gray-800 text-white border-gray-700"
              placeholder="Last Name"
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => updateProfileData({ email: e.target.value })}
              className="bg-gray-800 text-white border-gray-700"
              placeholder="Email Address"
              disabled
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Continue
        </Button>
      </CardFooter>
    </>
  );
};

export default ProfileBasicInfo;