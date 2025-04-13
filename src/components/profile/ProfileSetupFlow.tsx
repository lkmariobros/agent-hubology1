import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProfileBasicInfo from './ProfileBasicInfo';
import ProfileRoleSelection from './ProfileRoleSelection';
import ProfilePreferences from './ProfilePreferences';
import ProfileSetupComplete from './ProfileSetupComplete';
import { UserRole } from '@/types/auth';

enum ProfileSetupStep {
  WELCOME = 0,
  BASIC_INFO = 1,
  ROLE_SELECTION = 2,
  PREFERENCES = 3,
  COMPLETE = 4,
}

const ProfileSetupFlow: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { createUserProfile } = useClerkAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<ProfileSetupStep>(ProfileSetupStep.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    role: 'agent' as UserRole,
    agentLevel: 'junior',
    salesTarget: 0,
    preferredPortal: 'agent',
    darkMode: true,
    emailNotifications: true,
  });

  // Update profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
      }));
    }
  }, [user]);

  const handleCreateProfile = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      // Create the user profile with the selected role and additional profile data
      await createUserProfile(profileData.role, {
        agentLevel: profileData.agentLevel,
        salesTarget: profileData.salesTarget,
        darkMode: profileData.darkMode,
        emailNotifications: profileData.emailNotifications,
        preferredPortal: profileData.preferredPortal
      });
      
      console.log('[ProfileSetupFlow] Profile created with data:', profileData);
      
      // Move to the completion step
      setCurrentStep(ProfileSetupStep.COMPLETE);
    } catch (error: any) {
      console.error('[ProfileSetupFlow] Error creating profile:', error);
      toast.error(`Failed to create profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === ProfileSetupStep.PREFERENCES) {
      // This is the last step before completion, create the profile
      handleCreateProfile();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const updateProfileData = (updates: Partial<typeof profileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const renderStepIndicator = () => {
    const steps = [
      { name: 'Welcome', step: ProfileSetupStep.WELCOME },
      { name: 'Basic Info', step: ProfileSetupStep.BASIC_INFO },
      { name: 'Role', step: ProfileSetupStep.ROLE_SELECTION },
      { name: 'Preferences', step: ProfileSetupStep.PREFERENCES },
      { name: 'Complete', step: ProfileSetupStep.COMPLETE },
    ];

    return (
      <div className="flex justify-center mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.step 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`w-10 h-1 ${
                  currentStep > step.step 
                    ? 'bg-purple-600' 
                    : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ProfileSetupStep.WELCOME:
        return (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">Hi</span>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Welcome to Hubology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Thank you for joining our platform! Let's set up your profile to get you started.
              </p>
              <p className="text-gray-300">
                This quick setup will help us personalize your experience and provide you with the right access.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={nextStep}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Let's Get Started
              </Button>
            </CardFooter>
          </>
        );
        
      case ProfileSetupStep.BASIC_INFO:
        return (
          <ProfileBasicInfo 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            onNext={nextStep}
            onBack={prevStep}
          />
        );
        
      case ProfileSetupStep.ROLE_SELECTION:
        return (
          <ProfileRoleSelection 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            onNext={nextStep}
            onBack={prevStep}
          />
        );
        
      case ProfileSetupStep.PREFERENCES:
        return (
          <ProfilePreferences 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            onNext={nextStep}
            onBack={prevStep}
            isLoading={isLoading}
          />
        );
        
      case ProfileSetupStep.COMPLETE:
        return (
          <ProfileSetupComplete 
            profileData={profileData}
            onContinue={() => {
              // Navigate to the appropriate dashboard based on role
              if (profileData.role === 'admin') {
                navigate('/admin/dashboard');
              } else {
                navigate('/dashboard');
              }
            }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    >
      <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-sm shadow-2xl border-none">
        {currentStep !== ProfileSetupStep.WELCOME && currentStep !== ProfileSetupStep.COMPLETE && renderStepIndicator()}
        {renderStepContent()}
      </Card>
    </div>
  );
};

export default ProfileSetupFlow;