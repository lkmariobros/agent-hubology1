import React from 'react';
import { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ProfileSetupCompleteProps {
  profileData: any;
  onContinue: () => void;
}

const ProfileSetupComplete: React.FC<ProfileSetupCompleteProps> = ({ 
  profileData, 
  onContinue 
}) => {
  // Determine destination based on role
  const destination = profileData.role === 'admin' ? 'Admin Portal' : 'Agent Portal';
  
  // Determine role description
  const getRoleDescription = () => {
    switch (profileData.role) {
      case 'admin':
        return 'Administrator with full system access';
      case 'manager':
        return 'Manager overseeing multiple teams';
      case 'team_leader':
        return 'Team Leader managing a team of agents';
      case 'agent':
        const levelText = {
          'junior': 'Junior Agent (Sales < $5M)',
          'agent': 'Agent (Sales $5M - $15M)',
          'senior': 'Senior Agent (Sales $15M - $45M)',
          'associate-director': 'Associate Director (Sales $45M - $100M)',
          'director': 'Director (Sales > $100M)'
        }[profileData.agentLevel] || 'Agent';
        return levelText;
      default:
        return 'User';
    }
  };
  
  return (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Profile Setup Complete!</CardTitle>
        <CardDescription className="text-gray-400">
          You're all set to start using the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
          <div>
            <span className="text-gray-400">Name:</span> 
            <span className="text-white ml-2">{profileData.firstName} {profileData.lastName}</span>
          </div>
          <div>
            <span className="text-gray-400">Email:</span> 
            <span className="text-white ml-2">{profileData.email}</span>
          </div>
          <div>
            <span className="text-gray-400">Role:</span> 
            <span className="text-white ml-2">{getRoleDescription()}</span>
          </div>
          {profileData.role === 'agent' && profileData.salesTarget > 0 && (
            <div>
              <span className="text-gray-400">Sales Target:</span> 
              <span className="text-white ml-2">${profileData.salesTarget}M annually</span>
            </div>
          )}
          <div>
            <span className="text-gray-400">Default Portal:</span> 
            <span className="text-white ml-2">{profileData.preferredPortal === 'admin' ? 'Admin Portal' : 'Agent Portal'}</span>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-300">
            You will now be redirected to the {destination}.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            You can update your profile and preferences anytime from your account settings.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button 
          onClick={onContinue}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full"
        >
          Go to Dashboard
        </Button>
      </CardFooter>
    </>
  );
};

export default ProfileSetupComplete;