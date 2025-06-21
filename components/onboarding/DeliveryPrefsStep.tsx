
import React, { useState, useEffect } from 'react';
import { UserProfile, DeliveryPreferences, DeliveryFrequency, DeliveryFormat, PodcastApp } from '../../types';
import { PODCAST_APPS_LIST, ICONS, UI_TEXT_ACCENT, UI_BUTTON_PRIMARY_BG, UI_ACCENT_COLOR_CLASS, UI_SECONDARY_ACCENT_COLOR_CLASS } from '../../constants';
import Button from '../shared/Button';
import RadioGroup from '../shared/RadioGroup';
import Checkbox from '../shared/Checkbox';
import Input from '../shared/Input';

interface DeliveryPrefsStepProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  onNextStep: () => void;
}

const DeliveryPrefsStep: React.FC<DeliveryPrefsStepProps> = ({ userProfile, updateProfile, onNextStep }) => {
  const [preferences, setPreferences] = useState<DeliveryPreferences>(userProfile.deliveryPreferences);

  const handleFrequencyChange = (value: string) => {
    setPreferences(prev => ({ ...prev, frequency: value as DeliveryFrequency, customSchedule: value !== DeliveryFrequency.CUSTOM ? '' : prev.customSchedule }));
  };

  const handleFormatChange = (format: DeliveryFormat) => {
    const newFormats = preferences.formats.includes(format)
      ? preferences.formats.filter(f => f !== format)
      : [...preferences.formats, format];
    setPreferences(prev => ({ ...prev, formats: newFormats }));
  };
  
  const handlePodcastAppToggle = (appId: string) => {
    const newApps = preferences.podcastApps.includes(appId)
        ? preferences.podcastApps.filter(id => id !== appId)
        : [...preferences.podcastApps, appId];
    setPreferences(prev => ({ ...prev, podcastApps: newApps }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ deliveryPreferences: preferences });
    onNextStep();
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


  return (
    <div>
      <h2 className="text-3xl font-serif font-semibold mb-2 text-gray-900">Delivery Preferences</h2>
      <p className="text-gray-500 mb-8">Choose how and when you'd like to receive your personalized legal insights.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <RadioGroup
            legend="Digest Frequency"
            name="frequency"
            options={frequencyOptions}
            selectedValue={preferences.frequency}
            onChange={handleFrequencyChange}
          />
          {preferences.frequency === DeliveryFrequency.CUSTOM && (
            <div className="mt-3 pl-7">
              <Input
                id="customSchedule"
                label="Specify Custom Schedule (e.g., 'Mon & Thu mornings')"
                value={preferences.customSchedule}
                onChange={(e) => setPreferences(prev => ({ ...prev, customSchedule: e.target.value }))}
                placeholder="Describe your preferred schedule"
                icon={<ICONS.CALENDAR_DAYS className="h-5 w-5 text-gray-400" />}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Digest Format</h3>
          <div className="space-y-3">
            {formatOptions.map(opt => (
              <Checkbox
                key={opt.id}
                id={`format-${opt.id}`}
                label={<>{opt.icon} {opt.label}</>}
                checked={preferences.formats.includes(opt.id)}
                onChange={() => handleFormatChange(opt.id)}
              />
            ))}
          </div>
        </div>

        {preferences.formats.includes(DeliveryFormat.PODCAST) && (
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
            <h4 className="text-lg font-semibold font-serif mb-3 text-gray-800">Podcast Setup</h4>
            <p className="text-sm text-gray-600 mb-4">
              Connect your personalized podcast feed to your favorite app. 
              Copy the RSS feed link below or use the quick add buttons.
            </p>
            <Button
                onClick={copyRssFeed}
                variant="secondary" // Using secondary for this distinct action
                size="sm"
                leftIcon={<ICONS.RSS className="w-4 h-4" />}
                className="mb-4"
            >
                Copy Private RSS Feed
            </Button>
            
            <p className="text-sm text-gray-600 mb-2">Or, quickly add to (select your apps):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PODCAST_APPS_LIST.map((app) => (
                    <button
                        key={app.id}
                        type="button"
                        onClick={() => handlePodcastAppToggle(app.id)}
                        className={`flex items-center w-full text-left p-3 rounded-lg border-2 transition-all duration-150
                            ${preferences.podcastApps.includes(app.id) ? `bg-${UI_ACCENT_COLOR_CLASS}-600 border-${UI_ACCENT_COLOR_CLASS}-500 text-white shadow-lg` : `bg-gray-100 border-gray-300 hover:border-${UI_ACCENT_COLOR_CLASS}-400 hover:bg-gray-200 text-gray-700`}
                        `}
                    >
                        {app.icon}
                        <span className="font-medium">{app.name}</span>
                        {preferences.podcastApps.includes(app.id) && <ICONS.CHECK_CIRCLE className="w-5 h-5 ml-auto text-white" />}
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Note: Direct "Add to App" functionality varies by platform. Copying the RSS feed is the most universal method.
            </p>
          </div>
        )}
        
        <Button type="submit" variant="primary" className="w-full" size="lg">
          Next: Confirmation <ICONS.ARROW_RIGHT className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </div>
  );
};

export default DeliveryPrefsStep;
