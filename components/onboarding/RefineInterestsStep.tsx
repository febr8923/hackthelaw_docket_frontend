
import React, { useState } from 'react';
import { UserProfile, PracticeArea as PracticeAreaType } from '../../types';
import { PRACTICE_AREAS, ICONS } from '../../constants';
import Button from '../shared/Button';
import Checkbox from '../shared/Checkbox';
import TagInput from '../shared/TagInput';

interface RefineInterestsStepProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  onNextStep: () => void;
}

const RefineInterestsStep: React.FC<RefineInterestsStepProps> = ({ userProfile, updateProfile, onNextStep }) => {
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>(userProfile.practiceAreas);
  const [additionalInterests, setAdditionalInterests] = useState<string[]>(userProfile.additionalInterests);

  const handlePracticeAreaChange = (areaId: string) => {
    const newSelection = selectedPracticeAreas.includes(areaId)
      ? selectedPracticeAreas.filter(id => id !== areaId)
      : [...selectedPracticeAreas, areaId];
    setSelectedPracticeAreas(newSelection);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("idk"+userProfile.categories)
    updateProfile({ 
      practiceAreas: selectedPracticeAreas,
      additionalInterests: additionalInterests
    });
    onNextStep();
  };

  return (
    <div>
      <h2 className="text-3xl font-serif font-semibold mb-2 text-gray-900">Shape Your Docket</h2>
      <p className="text-gray-500 mb-8">Select your primary practice areas and add specific interests to tailor your content.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div hidden={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-h-72 overflow-y-auto pr-2 rounded-md border border-gray-200 p-4 bg-white shadow-inner">
            {PRACTICE_AREAS.map((area) => (
              <Checkbox
                key={area.id}
                id={`practiceArea-${area.id}`}
                label={area.name}
                checked={selectedPracticeAreas.includes(area.id)}
                onChange={() => handlePracticeAreaChange(area.id)}
              />
            ))}
          </div>
        </div>

        <div>
            
           <TagInput
            tags={additionalInterests}
            setTags={setAdditionalInterests}
            id="additionalInterests"
            label="Additional Fields of Interest"
            placeholder="e.g., 'AI in Law', 'Acme Corp', 'FinTech'"
            icon={<ICONS.TAG className="h-5 w-5 text-gray-400" />}
          />
          <p className="text-xs text-gray-500 mt-1">Add specific clients, industries, companies, or niche topics.</p>
        </div>
        
        <Button type="submit" variant="primary" className="w-full" size="lg">
          Next: Delivery Preferences <ICONS.ARROW_RIGHT className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </div>
  );
};

export default RefineInterestsStep;
