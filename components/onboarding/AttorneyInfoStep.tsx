import React, { useState, useEffect } from 'react';
import { UserProfile, AttorneyInfo, FoundBio } from '../../types';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Spinner from '../shared/Spinner';
import { ICONS, UI_TEXT_ACCENT, UI_ACCENT_COLOR_CLASS } from '../../constants';
import { expandLawFirmName } from '../../services/geminiService';
import { post_request, post_request_report } from './_requests';


interface AttorneyInfoStepProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  onAttorneyInfoSubmit: (info: AttorneyInfo) => Promise<void>;
  isLoadingBio: boolean;
  foundBio: FoundBio | null;
  bioError: string | null;
  onConfirmBioAndProceed: () => void;
  onEditBioOrProceed: () => void;
  onBioCheckFinishedWithoutConfirmation: () => void; 
}

const getCompanyFromEmail = (email: string): string => {
  if (!email || !email.includes('@')) return '';

  const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
  const publicDomains = [
    'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'icloud.com', 
    'protonmail.com', 'zoho.com', 'gmx.com', 'mail.com', 'live.com', 'msn.com',
    'googlemail.com', 'ymail.com'
  ];
  if (publicDomains.includes(domain)) return '';

  let parts = domain.split('.');
  
  if (parts.length > 1) {
    parts.pop(); 
  }
  
  if (parts.length > 1 && ['co', 'ac', 'org', 'gov', 'com', 'net', 'edu', 'me', 'info', 'biz'].includes(parts[parts.length - 1])) {
     parts.pop(); 
  }
  
  let companyName = parts.join('.'); 
  companyName = companyName.replace(/-/g, ' ');

  const suffixesToClean = [
    'llp', 'llc', 'plc', 'ltd', 'limited', 'inc', 'incorporated', 'corp', 'corporation',
    'co', 'company', 'group', 'associates', 'partners', 'legal', 'law', 'advocates',
    'solicitors', 'chambers', 'consulting', 'services', 'solutions', 
    'gmbh', 'ag', 'bv', 'sas', 'sarl', 'ab', 'oy', 'as', 'sa', 'pty'
  ];

  let cleanedName = companyName;
  const wordsInName = companyName.split(' ');
  const lastWord = wordsInName[wordsInName.length - 1].toLowerCase();

  for (const suffix of suffixesToClean) {
    if (lastWord === suffix) {
      wordsInName.pop();
      cleanedName = wordsInName.join(' ');
      break; 
    }
  }
  
  if (wordsInName.length === 1 && cleanedName === companyName) { 
     for (const suffix of suffixesToClean) {
        if (cleanedName.toLowerCase().endsWith(suffix) && cleanedName.length > suffix.length) {
            cleanedName = cleanedName.substring(0, cleanedName.length - suffix.length);
            break;
        }
     }
  }
  
  if (!cleanedName.trim()) return ''; 

  const finalCandidateForAcronym = cleanedName.replace(/\s+/g, '');
  if (finalCandidateForAcronym.length > 0 && finalCandidateForAcronym.length <= 4) {
    return finalCandidateForAcronym.toUpperCase();
  }

  return cleanedName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


const AttorneyInfoStep: React.FC<AttorneyInfoStepProps> = ({
  userProfile,
  updateProfile,
  onAttorneyInfoSubmit,
  isLoadingBio,
  foundBio,
  bioError,
  onConfirmBioAndProceed,
  onEditBioOrProceed,
  onBioCheckFinishedWithoutConfirmation
}) => {
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [categories, setCategories] = useState(userProfile.categories);
  const [workEmail, setWorkEmail] = useState(userProfile.workEmail);
  const [lawFirm, setLawFirm] = useState(userProfile.lawFirm);
  const [submitted, setSubmitted] = useState(false);
  const [animateLawFirm, setAnimateLawFirm] = useState(false);
  const [isExpandingFirmName, setIsExpandingFirmName] = useState(false);
  const [llmSuggestedFirmName, setLlmSuggestedFirmName] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && workEmail && lawFirm) {
      setIsPosting(true);
      try {
        const result = await post_request(fullName, lawFirm);
        console.log("Categories received:", result);


        setSubmitted(true);
        updateProfile({ categories: result, additionalInterests: result });
        //updateProfile({additionalInterests: result["areas_of_interest"] || []});
        post_request_report(fullName, lawFirm, "categories");
        //console.log("Categories received:", result);
        await onAttorneyInfoSubmit({ fullName, workEmail, lawFirm });
      } catch (error) {
        console.error("Error during submission:", error);
      } finally {
        setIsPosting(false);
      }
    }
  };
  
  useEffect(() => {
    if (submitted && !isLoadingBio && !foundBio && !bioError) {
      onBioCheckFinishedWithoutConfirmation();
    }
  }, [submitted, isLoadingBio, foundBio, bioError, onBioCheckFinishedWithoutConfirmation]);

  const handleWorkEmailBlur = async () => {
    if (workEmail && lawFirm.trim() === '') { // Only if law firm is currently empty
      const derivedFirmName = getCompanyFromEmail(workEmail);
      if (derivedFirmName) {
        setLawFirm(derivedFirmName);
        updateProfile({ lawFirm: derivedFirmName });
        setAnimateLawFirm(true);
        setTimeout(() => setAnimateLawFirm(false), 800);

        setLlmSuggestedFirmName(null);
        setIsExpandingFirmName(true);
        try {
          const emailDomain = workEmail.substring(workEmail.lastIndexOf('@') + 1);
          const expandedName = await expandLawFirmName(derivedFirmName, emailDomain);
          if (expandedName && expandedName.toLowerCase() !== derivedFirmName.toLowerCase()) {
            setLlmSuggestedFirmName(expandedName);
          }
        } catch (error) {
          console.error("Error expanding firm name via LLM:", error);
        } finally {
          setIsExpandingFirmName(false);
        }
      }
    }
  };
  
  const handleLawFirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLawFirm(e.target.value);
    updateProfile({ lawFirm: e.target.value });
    if (llmSuggestedFirmName) { // Clear suggestion if user types
        setLlmSuggestedFirmName(null);
    }
  };

  if (isLoadingBio) {
    return <Spinner message="Verifying information..." size="lg" className="my-10" />;
  }

  if (foundBio && submitted) {
    return (
      <div className="text-center p-6 bg-primaryAccent-50 rounded-lg shadow-lg border border-primaryAccent-200">
        <ICONS.CHECK_CIRCLE className={`w-16 h-16 ${UI_TEXT_ACCENT} mx-auto mb-4`} />
        <h3 className="text-2xl font-semibold font-serif mb-2 text-gray-800">We found a profile!</h3>
        <p className="text-gray-600 mb-4">Is this you?</p>
        <div className="bg-white p-4 rounded-md text-left mb-6 shadow border border-gray-200">
          <p className="text-lg font-medium text-gray-900">{foundBio.name}</p>
          {foundBio.practiceArea && <p className="text-sm text-gray-500">{foundBio.practiceArea}</p>}
        </div>
        <div className="space-y-3 md:space-y-0 md:space-x-3">
          <Button onClick={onConfirmBioAndProceed} variant="primary" className="w-full md:w-auto">
            <ICONS.CHECK_CIRCLE className="w-5 h-5 mr-2" /> Yes, that's me!
          </Button>
          <Button onClick={onEditBioOrProceed} variant="secondary" className="w-full md:w-auto">
            <ICONS.PENCIL className="w-5 h-5 mr-2" /> No, let me edit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-serif font-semibold mb-2 text-gray-900">Your Professional Identity</h2>
      <p className="text-gray-500 mb-8">Let's get to know you to personalize your experience.</p>
      
      {bioError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Verification Error: </strong>
          <span className="block sm:inline">{bioError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="fullName"
          label="Full Name"
          value={fullName}
          onChange={(e) => { setFullName(e.target.value); updateProfile({fullName: e.target.value}); }}
          placeholder="e.g., Jane Doe"
          required
          icon={<ICONS.USER_CIRCLE className="h-5 w-5 text-gray-400"/>}
        />
        <Input
          id="workEmail"
          label="Work Email"
          type="email"
          value={workEmail}
          onChange={(e) => { setWorkEmail(e.target.value); updateProfile({workEmail: e.target.value});}}
          onBlur={handleWorkEmailBlur}
          placeholder="your.name@firm.com"
          required
          icon={<ICONS.ENVELOPE className="h-5 w-5 text-gray-400"/>}
        />
        <div>
            <div className="relative">
                <Input
                  id="lawFirm"
                  label="Law Firm / Company Name"
                  value={lawFirm}
                  onChange={handleLawFirmChange}
                  placeholder="e.g., Linklaters LLP"
                  required
                  icon={<ICONS.BUILDING_OFFICE_2 className="h-5 w-5 text-gray-400"/>}
                  className={`${animateLawFirm ? 'animate-field-populated-soft' : ''} ${isExpandingFirmName ? 'pr-10' : ''}`} // Add padding for spinner
                  wrapperClassName="mb-1" // Reduce bottom margin for suggestion
                />
                {isExpandingFirmName && (
                    <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none"> 
                        <Spinner size="sm" />
                    </div>
                )}
            </div>
            {llmSuggestedFirmName && !isExpandingFirmName && (
              <div className="mt-1 text-xs sm:text-sm text-gray-600 pl-1">
                Did you mean:{" "}
                <button
                  type="button"
                  className={`font-semibold ${UI_TEXT_ACCENT} hover:underline focus:outline-none`}
                  onClick={() => {
                    setLawFirm(llmSuggestedFirmName);
                    updateProfile({ lawFirm: llmSuggestedFirmName });
                    setLlmSuggestedFirmName(null);
                    setAnimateLawFirm(true); 
                    setTimeout(() => setAnimateLawFirm(false), 800);
                  }}
                >
                  {llmSuggestedFirmName}
                </button>
                ?
              </div>
            )}
        </div>
        <Button type="submit" variant="primary" className="w-full" size="lg" disabled={isLoadingBio || isPosting || !fullName || !workEmail || !lawFirm}>
          {isLoadingBio || isPosting ? <Spinner size="sm" /> : 'Find My Bio & Continue'} 
          {!(isLoadingBio || isPosting) && <ICONS.ARROW_RIGHT className="w-5 h-5 ml-2" />}
        </Button>
      </form>
       {/* Fallback if user doesn't want to use bio finding or it fails badly */}
      {!isLoadingBio && submitted && bioError && (
         <Button onClick={onEditBioOrProceed} variant="link" className="mt-4 w-full text-center">
            Or, skip verification and continue manually
          </Button>
      )}
    </div>
  );
};

export default AttorneyInfoStep;
