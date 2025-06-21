
import React, { useState, useEffect } from 'react';
import { UserProfile, PracticeArea as PracticeAreaType, DeliveryFrequency, DeliveryFormat, PodcastApp } from '../../types';
import { PRACTICE_AREAS, PODCAST_APPS_LIST, ICONS, UI_TEXT_ACCENT, UI_BUTTON_PRIMARY_BG, UI_ACCENT_COLOR_CLASS } from '../../constants';
import Button from '../shared/Button';
import Checkbox from '../shared/Checkbox';
import RadioGroup from '../shared/RadioGroup';
import TagInput from '../shared/TagInput';
import Input from '../shared/Input';
import { SVGIconProps } from '../icons/HeroIcons'; 

interface PreferencesCardProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const PreferencesCard: React.FC<PreferencesCardProps> = ({ userProfile, updateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setFormData(userProfile); 
  }, [userProfile]);

  const handleInputChange = (field: keyof UserProfile['deliveryPreferences'] | keyof UserProfile, value: any) => {
    if (['frequency', 'customSchedule', 'formats', 'podcastApps'].includes(field as string)) {
      setFormData(prev => ({
        ...prev,
        deliveryPreferences: {
          ...prev.deliveryPreferences,
          [field]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field as keyof UserProfile]: value }));
    }
  };
  
  const handlePracticeAreaChange = (areaId: string) => {
    const newSelection = formData.practiceAreas.includes(areaId)
      ? formData.practiceAreas.filter(id => id !== areaId)
      : [...formData.practiceAreas, areaId];
    handleInputChange('practiceAreas', newSelection);
  };
  
  const handleFormatChange = (format: DeliveryFormat) => {
    const newFormats = formData.deliveryPreferences.formats.includes(format)
      ? formData.deliveryPreferences.formats.filter(f => f !== format)
      : [...formData.deliveryPreferences.formats, format];
    setFormData(prev => ({
        ...prev,
        deliveryPreferences: {
            ...prev.deliveryPreferences,
            formats: newFormats
        }
    }));
  };

  const handlePodcastAppToggle = (appId: string) => {
    const newApps = formData.deliveryPreferences.podcastApps.includes(appId)
        ? formData.deliveryPreferences.podcastApps.filter(id => id !== appId)
        : [...formData.deliveryPreferences.podcastApps, appId];
    setFormData(prev => ({
        ...prev,
        deliveryPreferences: {
            ...prev.deliveryPreferences,
            podcastApps: newApps
        }
    }));
  };


  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };
  
  const frequencyOptions = [
    { value: DeliveryFrequency.WEEKLY, label: 'Weekly Digest' },
    { value: DeliveryFrequency.BI_WEEKLY, label: 'Bi-Weekly Digest' },
    { value: DeliveryFrequency.CUSTOM, label: 'Custom Schedule' },
  ];

  const formatOptions = [
    { id: DeliveryFormat.EMAIL, label: 'Email Digest', icon: <ICONS.ENVELOPE className="w-5 h-5 mr-2 inline text-gray-500" /> },
    { id: DeliveryFormat.PODCAST, label: 'Podcast Digest (Audio Summaries)', icon: <ICONS.MICROPHONE className="w-5 h-5 mr-2 inline text-gray-500" /> },
  ];

  const copyRssFeed = () => {
    const rssFeedUrl = "https://your-legal-digest-ai-rss-feed.com/feed.xml"; // Placeholder
    navigator.clipboard.writeText(rssFeedUrl)
      .then(() => alert("RSS Feed URL copied to clipboard!"))
      .catch(err => console.error("Failed to copy RSS feed URL: ", err));
  };


  if (!isEditing) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-semibold text-gray-900">My Preferences</h2>
          <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm" leftIcon={<ICONS.PENCIL className="w-4 h-4"/>}>Edit</Button>
        </div>
        <div className="space-y-5">
          <PreferenceItem label="Full Name" value={userProfile.fullName} icon={<ICONS.USER_CIRCLE className="w-5 h-5 text-gray-500"/>} />
          <PreferenceItem label="Work Email" value={userProfile.workEmail} icon={<ICONS.ENVELOPE className="w-5 h-5 text-gray-500"/>} />
          <PreferenceItem label="Law Firm" value={userProfile.lawFirm} icon={<ICONS.BUILDING_OFFICE_2 className="w-5 h-5 text-gray-500"/>} />
          <PreferenceItem label="Additional Interests" value={userProfile.additionalInterests.join(', ') || 'N/A'} icon={<ICONS.TAG className="w-5 h-5 text-gray-500"/>} />
          <PreferenceItem label="Digest Frequency" value={`${frequencyOptions.find(f => f.value === userProfile.deliveryPreferences.frequency)?.label || 'N/A'}${userProfile.deliveryPreferences.frequency === DeliveryFrequency.CUSTOM && userProfile.deliveryPreferences.customSchedule ? ` (${userProfile.deliveryPreferences.customSchedule})` : ''}`} icon={<ICONS.CALENDAR_DAYS className="w-5 h-5 text-gray-500"/>} />
          <PreferenceItem label="Digest Formats" value={userProfile.deliveryPreferences.formats.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ') || 'N/A'} icon={<ICONS.MICROPHONE className="w-5 h-5 text-gray-500"/>} />
           {userProfile.deliveryPreferences.formats.includes(DeliveryFormat.PODCAST) && (
             <PreferenceItem label="Selected Podcast Apps" value={userProfile.deliveryPreferences.podcastApps.map(id => PODCAST_APPS_LIST.find(p => p.id === id)?.name).filter(Boolean).join(', ') || 'N/A'} icon={<ICONS.RSS className="w-5 h-5 text-gray-500"/>} />
           )}
        </div>
      </div>
    );
  }

  // Editing View
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
      <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-8">Edit Preferences</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
        <Input id="editFullName" label="Full Name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} icon={<ICONS.USER_CIRCLE className="h-5 w-5 text-gray-400"/>} />
        <Input id="editWorkEmail" label="Work Email" type="email" value={formData.workEmail} onChange={(e) => handleInputChange('workEmail', e.target.value)} icon={<ICONS.ENVELOPE className="h-5 w-5 text-gray-400"/>} />
        <Input id="editLawFirm" label="Law Firm / Company Name" value={formData.lawFirm} onChange={(e) => handleInputChange('lawFirm', e.target.value)} icon={<ICONS.BUILDING_OFFICE_2 className="h-5 w-5 text-gray-400"/>} />
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Practice Areas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-h-60 overflow-y-auto p-3 border border-gray-200 rounded-md bg-white shadow-inner">
            {PRACTICE_AREAS.map((area) => (
              <Checkbox key={area.id} id={`editPracticeArea-${area.id}`} label={area.name} checked={formData.practiceAreas.includes(area.id)} onChange={() => handlePracticeAreaChange(area.id)} />
            ))}
          </div>
        </div>

         <TagInput
            tags={formData.additionalInterests}
            setTags={(tags) => handleInputChange('additionalInterests', tags)}
            id="editAdditionalInterests"
            label="Additional Fields of Interest"
            placeholder="e.g., 'AI in Law', 'Acme Corp', 'FinTech'"
            icon={<ICONS.TAG className="h-5 w-5 text-gray-400" />}
          />

        <div>
            <RadioGroup
                legend="Digest Frequency"
                name="editFrequency"
                options={frequencyOptions}
                selectedValue={formData.deliveryPreferences.frequency}
                onChange={(value) => {
                    const newFrequency = value as DeliveryFrequency;
                    const newCustomSchedule = newFrequency !== DeliveryFrequency.CUSTOM ? '' : formData.deliveryPreferences.customSchedule;
                    setFormData(prev => ({
                        ...prev,
                        deliveryPreferences: {
                            ...prev.deliveryPreferences,
                            frequency: newFrequency,
                            customSchedule: newCustomSchedule
                        }
                    }));
                }}
            />
            {formData.deliveryPreferences.frequency === DeliveryFrequency.CUSTOM && (
                <div className="mt-3 pl-7">
                <Input
                    id="editCustomSchedule"
                    label="Specify Custom Schedule"
                    value={formData.deliveryPreferences.customSchedule}
                    onChange={(e) => handleInputChange('customSchedule', e.target.value)}
                    placeholder="e.g., 'Mon & Thu mornings'"
                    icon={<ICONS.CALENDAR_DAYS className="h-5 w-5 text-gray-400" />}
                />
                </div>
            )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Digest Format</h3>
          <div className="space-y-2">
            {formatOptions.map(opt => (
              <Checkbox
                key={`editFormat-${opt.id}`}
                id={`editFormat-${opt.id}`}
                label={<>{opt.icon} {opt.label}</>}
                checked={formData.deliveryPreferences.formats.includes(opt.id)}
                onChange={() => handleFormatChange(opt.id)}
              />
            ))}
          </div>
        </div>
         {formData.deliveryPreferences.formats.includes(DeliveryFormat.PODCAST) && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
            <h4 className="text-md font-semibold font-serif mb-2 text-gray-800">Podcast Setup</h4>
            <Button
                onClick={copyRssFeed}
                variant="secondary"
                size="sm"
                leftIcon={<ICONS.RSS className="w-4 h-4" />}
                className="mb-3"
                type="button"
            >
                Copy Private RSS Feed
            </Button>
            <p className="text-sm text-gray-600 mb-1">Selected Podcast Apps:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PODCAST_APPS_LIST.map((app) => (
                    <button
                        key={app.id}
                        type="button"
                        onClick={() => handlePodcastAppToggle(app.id)}
                        className={`flex items-center w-full text-left p-2 rounded-md border-2 transition-all duration-150 text-sm
                            ${formData.deliveryPreferences.podcastApps.includes(app.id) ? `bg-${UI_ACCENT_COLOR_CLASS}-600 border-${UI_ACCENT_COLOR_CLASS}-500 text-white` : `bg-gray-100 border-gray-300 hover:border-${UI_ACCENT_COLOR_CLASS}-400 text-gray-700`}
                        `}
                    >
                        {app.icon}
                        <span className="font-medium">{app.name}</span>
                        {formData.deliveryPreferences.podcastApps.includes(app.id) && <ICONS.CHECK_CIRCLE className="w-4 h-4 ml-auto text-white" />}
                    </button>
                ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" onClick={() => { setIsEditing(false); setFormData(userProfile); }} variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};


const PreferenceItem: React.FC<{ label: string; value: string | undefined; icon?: React.ReactElement<SVGIconProps> }> = ({ label, value, icon }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500 flex items-center">
      {icon && React.cloneElement(icon, { className: 'w-5 h-5 mr-2 flex-shrink-0' })}
      {label}
    </h4>
    <p className={`text-gray-800 ${icon ? 'ml-7' : ''}`}>{value || 'N/A'}</p>
  </div>
);


export default PreferencesCard;
