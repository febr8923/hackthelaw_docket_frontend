
import React, { useEffect } from 'react';
import { UserProfile, DeliveryFrequency, PracticeArea, DeliveryFormat } from '../../types';
import { PRACTICE_AREAS, PODCAST_APPS_LIST, ICONS, UI_TEXT_ACCENT, UI_ACCENT_COLOR_CLASS } from '../../constants';
import Button from '../shared/Button';

interface ConfirmationStepProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void; 
  onComplete: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ userProfile, onComplete }) => {
  
  useEffect(() => {
  }, []);

  const getPracticeAreaNames = (ids: string[]): string[] => {
    return ids.map(id => PRACTICE_AREAS.find(p => p.id === id)?.name).filter(Boolean) as string[];
  };

  const getPodcastAppNames = (ids: string[]): string[] => {
    return ids.map(id => PODCAST_APPS_LIST.find(p => p.id === id)?.name).filter(Boolean) as string[];
  };
  
  const frequencyLabels = {
    [DeliveryFrequency.WEEKLY]: 'Weekly',
    [DeliveryFrequency.BI_WEEKLY]: 'Bi-Weekly',
    [DeliveryFrequency.CUSTOM]: 'Custom Schedule',
  };

  return (
    <div className="text-center">
      <ICONS.CHECK_CIRCLE className={`w-20 h-20 text-${UI_ACCENT_COLOR_CLASS}-500 mx-auto mb-6 animate-pulse-gentle`} />
      <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">You're All Set!</h2>
      <p className="text-gray-700 mb-8 text-lg max-w-md mx-auto">
        Your personalized legal digest experience is ready. Here's a summary of your preferences:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-left space-y-4 mb-10 max-w-lg mx-auto border border-gray-200">
        <div>
          <h4 className="font-semibold text-gray-800">Professional Info:</h4>
          <p className="text-sm text-gray-600">
            {userProfile.fullName} <br />
            {userProfile.workEmail} <br />
            {userProfile.lawFirm}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Practice Areas:</h4>
          <p className="text-sm text-gray-600">
            {getPracticeAreaNames(userProfile.practiceAreas).join(', ') || 'None selected'}
          </p>
        </div>
        {userProfile.additionalInterests.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800">Additional Interests:</h4>
            <p className="text-sm text-gray-600">
              {userProfile.additionalInterests.join(', ')}
            </p>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-800">Delivery:</h4>
          <p className="text-sm text-gray-600">
            {frequencyLabels[userProfile.deliveryPreferences.frequency]}
            {userProfile.deliveryPreferences.frequency === DeliveryFrequency.CUSTOM && userProfile.deliveryPreferences.customSchedule && ` (${userProfile.deliveryPreferences.customSchedule})`}
            <br />
            Formats: {userProfile.deliveryPreferences.formats.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ') || 'None selected'}
          </p>
          {userProfile.deliveryPreferences.formats.includes(DeliveryFormat.PODCAST) && userProfile.deliveryPreferences.podcastApps.length > 0 && (
             <p className="text-sm text-gray-600 mt-1">
                Selected Podcast Apps: {getPodcastAppNames(userProfile.deliveryPreferences.podcastApps).join(', ')}
             </p>
          )}
        </div>
      </div>
      
      

      <Button onClick={onComplete} variant="primary" size="lg" className="transform hover:scale-105">
        Go to My Dashboard <ICONS.ARROW_RIGHT className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default ConfirmationStep;
