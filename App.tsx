
import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, OnboardingStep, DeliveryFrequency, AttorneyInfo, FoundBio } from './types';
import WelcomeStep from './components/onboarding/WelcomeStep';
import AttorneyInfoStep from './components/onboarding/AttorneyInfoStep';
import RefineInterestsStep from './components/onboarding/RefineInterestsStep';
import DeliveryPrefsStep from './components/onboarding/DeliveryPrefsStep';
import ConfirmationStep from './components/onboarding/ConfirmationStep';
import Dashboard from './components/dashboard/Dashboard';
import { APP_NAME, UI_ACCENT_COLOR_CLASS } from './constants';
import { findBio as fetchBio } from './services/geminiService'; // Mocked service

const initialUserProfile: UserProfile = {
  fullName: '',
  workEmail: '',
  lawFirm: '',
  categories: '',
  practiceAreas: [],
  additionalInterests: [],
  deliveryPreferences: {
    frequency: DeliveryFrequency.WEEKLY,
    customSchedule: '',
    formats: [],
    podcastApps: [],
  },
  enableHighVolatilityAlerts: false,
  alertDeliveryMethod: 'email',
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.Welcome);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [isLoadingBio, setIsLoadingBio] = useState<boolean>(false);
  const [foundBio, setFoundBio] = useState<FoundBio | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);

  const handleNextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep === OnboardingStep.Confirmation) {
        setIsOnboardingComplete(true);
        return prevStep; 
      }
      return prevStep + 1;
    });
  }, []);

  const handleAttorneyInfoSubmit = useCallback(async (info: AttorneyInfo) => {
    setUserProfile(prev => ({ ...prev, ...info }));
    setIsLoadingBio(true);
    setBioError(null);
    setFoundBio(null);
    try {
      const bioResult = await fetchBio(info.workEmail, info.lawFirm);
      if (bioResult) {
        setFoundBio(bioResult);
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
      setBioError("Could not connect to verify information. Please proceed manually.");
    } finally {
      setIsLoadingBio(false);
    }
  }, []);
  
  const handleConfirmBioAndProceed = useCallback(() => {
    if (foundBio) {
      setUserProfile(prev => ({
        ...prev,
        fullName: foundBio.name, 
      }));
    }
    setFoundBio(null); 
    handleNextStep(); 
  }, [foundBio, handleNextStep]);

  const handleEditBioOrProceed = useCallback(() => {
    setFoundBio(null); 
    handleNextStep();
  }, [handleNextStep]);


  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const renderStep = () => {
    const commonProps = { userProfile, updateProfile };
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeStep onGetStarted={handleNextStep} />;
      case OnboardingStep.AttorneyInfo:
        return (
          <AttorneyInfoStep
            {...commonProps}
            onAttorneyInfoSubmit={handleAttorneyInfoSubmit}
            isLoadingBio={isLoadingBio}
            foundBio={foundBio}
            bioError={bioError}
            onConfirmBioAndProceed={handleConfirmBioAndProceed}
            onEditBioOrProceed={handleEditBioOrProceed}
            onBioCheckFinishedWithoutConfirmation={handleNextStep} 
          />
        );
      case OnboardingStep.RefineInterests:
        return <RefineInterestsStep {...commonProps} onNextStep={handleNextStep} />;
      case OnboardingStep.DeliveryPreferences:
        return <DeliveryPrefsStep {...commonProps} onNextStep={handleNextStep} />;
      case OnboardingStep.Confirmation:
        return <ConfirmationStep {...commonProps} onComplete={() => {
          setIsOnboardingComplete(true);
        }} />;
      default:
        return <WelcomeStep onGetStarted={handleNextStep} />;
    }
  };

  if (isOnboardingComplete) {
    return <Dashboard userProfile={userProfile} updateProfile={updateProfile} />;
  }
  
  const totalSteps = Object.keys(OnboardingStep).length / 2; 
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={`min-h-screen bg-white flex flex-col items-center justify-center p-4 selection:bg-${UI_ACCENT_COLOR_CLASS}-500 selection:text-white`}>
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <img src="/logo.png" alt={`${APP_NAME} logo`} className="h-10 w-auto " />
        {!isOnboardingComplete && currentStep > OnboardingStep.Welcome && currentStep < OnboardingStep.Confirmation && (
           <div className="w-1/3">
            <div className="text-gray-500 text-sm mb-1 text-right">Step {currentStep +1} of {totalSteps}</div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`bg-${UI_ACCENT_COLOR_CLASS}-500 h-2 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${progressPercentage}%`}}
              />
            </div>
          </div>
        )}
      </header>
      <main className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-8 md:p-12 transition-all duration-500 ease-in-out border border-gray-100 mt-16 sm:mt-20"> {/* Added margin-top to prevent overlap with fixed header */}
        <div key={currentStep} className="animate-fadeIn">
          {renderStep()}
        </div>
      </main>
      <footer className="text-center text-gray-500 mt-8 text-sm">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
