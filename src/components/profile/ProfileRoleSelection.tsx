import React from 'react';
import { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@/types/auth';

interface ProfileRoleSelectionProps {
  profileData: any;
  updateProfileData: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProfileRoleSelection: React.FC<ProfileRoleSelectionProps> = ({
  profileData,
  updateProfileData,
  onNext,
  onBack
}) => {
  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    updateProfileData({ role });

    // If selecting agent role, we also set the agent level
    if (role === 'agent') {
      updateProfileData({
        role,
        agentLevel: 'junior',
        preferredPortal: 'agent'
      });
    } else if (role === 'admin') {
      updateProfileData({
        role,
        preferredPortal: 'admin'
      });
    }
  };

  // Handle agent level change
  const handleAgentLevelChange = (agentLevel: string) => {
    updateProfileData({ agentLevel });
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Select Your Role</CardTitle>
        <CardDescription className="text-gray-400">
          Choose the role that best describes your position
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={profileData.role}
          onValueChange={(value) => handleRoleChange(value as UserRole)}
          className="space-y-4"
        >
          <div className={`p-4 rounded-lg border ${profileData.role === 'agent' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800/40'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="agent" id="agent" className="text-purple-500" />
              <Label htmlFor="agent" className="text-white font-medium text-lg cursor-pointer">Agent</Label>
            </div>
            <div className="pl-7 mt-2 text-gray-400 text-sm">
              Standard agent access to the platform. Complete deals, track commissions, and manage your clients.
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${profileData.role === 'team_leader' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800/40'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="team_leader" id="team_leader" className="text-purple-500" />
              <Label htmlFor="team_leader" className="text-white font-medium text-lg cursor-pointer">Team Leader</Label>
            </div>
            <div className="pl-7 mt-2 text-gray-400 text-sm">
              Lead a team of agents. View team performance, approve commissions, and manage your team.
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${profileData.role === 'manager' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800/40'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="manager" id="manager" className="text-purple-500" />
              <Label htmlFor="manager" className="text-white font-medium text-lg cursor-pointer">Manager</Label>
            </div>
            <div className="pl-7 mt-2 text-gray-400 text-sm">
              Oversee multiple teams. Access comprehensive reporting, approve high-value commissions.
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${profileData.role === 'admin' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800/40'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="admin" id="admin" className="text-purple-500" />
              <Label htmlFor="admin" className="text-white font-medium text-lg cursor-pointer">Administrator</Label>
            </div>
            <div className="pl-7 mt-2 text-gray-400 text-sm">
              Full system access. Configure settings, manage users, and control all aspects of the platform.
            </div>
          </div>
        </RadioGroup>

        {/* Show agent level selection only if agent role is selected */}
        {profileData.role === 'agent' && (
          <div className="mt-6">
            <Label className="text-white mb-2 block">Agent Level</Label>
            <RadioGroup
              value={profileData.agentLevel}
              onValueChange={handleAgentLevelChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="junior" id="junior" className="text-blue-500" />
                <Label htmlFor="junior" className="text-white cursor-pointer">Junior Agent (Sales &lt; $5M)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="agent" id="agent-level" className="text-green-500" />
                <Label htmlFor="agent-level" className="text-white cursor-pointer">Agent (Sales $5M - $15M)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="senior" id="senior" className="text-yellow-500" />
                <Label htmlFor="senior" className="text-white cursor-pointer">Senior Agent (Sales $15M - $45M)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="associate-director" id="associate-director" className="text-orange-500" />
                <Label htmlFor="associate-director" className="text-white cursor-pointer">Associate Director (Sales $45M - $100M)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="director" id="director" className="text-red-500" />
                <Label htmlFor="director" className="text-white cursor-pointer">Director (Sales &gt; $100M)</Label>
              </div>
            </RadioGroup>
          </div>
        )}
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

export default ProfileRoleSelection;