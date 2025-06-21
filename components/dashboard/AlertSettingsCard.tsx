
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import Button from '../shared/Button';
import RadioGroup from '../shared/RadioGroup';
import { ICONS, UI_FOCUS_RING, UI_ACCENT_COLOR_CLASS } from '../../constants';

interface AlertSettingsCardProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AlertSettingsCard: React.FC<AlertSettingsCardProps> = ({ userProfile, updateProfile }) => {
  const [enableAlerts, setEnableAlerts] = useState(userProfile.enableHighVolatilityAlerts);
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'in-app'>(userProfile.alertDeliveryMethod);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);


  useEffect(() => {
    setEnableAlerts(userProfile.enableHighVolatilityAlerts);
    setDeliveryMethod(userProfile.alertDeliveryMethod);
  }, [userProfile]);

  const handleSave = () => {
    updateProfile({
      enableHighVolatilityAlerts: enableAlerts,
      alertDeliveryMethod: deliveryMethod,
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000); 
  };
  
  const alertDeliveryOptions = [
    { value: 'email', label: 'Email Notification' },
    { value: 'in-app', label: 'In-App Notification (Coming Soon)' }, 
  ];

  const ToggleSwitch: React.FC<{enabled: boolean; onChange: (enabled: boolean) => void}> = ({enabled, onChange}) => (
    <button
      type="button"
      className={`${enabled ? `bg-${UI_ACCENT_COLOR_CLASS}-600` : 'bg-gray-300'} relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${UI_FOCUS_RING} focus:ring-offset-2 focus:ring-offset-white`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );


  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-900">High Volatility Alerts</h2>
         {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm" leftIcon={<ICONS.PENCIL className="w-4 h-4"/>}>Edit</Button>
         )}
      </div>
      <p className="text-gray-600 mb-6">
        Receive instant notifications for critical, time-sensitive legal events or news that could significantly impact your practice areas or specified interests.
      </p>

      {saved && !isEditing && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
          <ICONS.CHECK_CIRCLE className="w-5 h-5 mr-2 text-green-500"/>
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h4 className="text-lg font-medium text-gray-800">Enable Instant Alerts</h4>
            <p className="text-sm text-gray-500">Toggle to turn on/off high volatility event notifications.</p>
          </div>
          {isEditing ? (
            <ToggleSwitch enabled={enableAlerts} onChange={setEnableAlerts} />
          ) : (
             <span className={`px-3 py-1 text-sm font-semibold rounded-full ${userProfile.enableHighVolatilityAlerts ? `bg-${UI_ACCENT_COLOR_CLASS}-200 text-${UI_ACCENT_COLOR_CLASS}-800` : 'bg-gray-200 text-gray-700'}`}>
                {userProfile.enableHighVolatilityAlerts ? 'ON' : 'OFF'}
             </span>
          )}
        </div>

        {(isEditing ? enableAlerts : userProfile.enableHighVolatilityAlerts) && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <RadioGroup
              legend="Alert Delivery Method"
              name="alertDelivery"
              options={alertDeliveryOptions}
              selectedValue={isEditing ? deliveryMethod : userProfile.alertDeliveryMethod}
              onChange={(value) => isEditing && setDeliveryMethod(value as 'email' | 'in-app')}
            />
             {!isEditing && userProfile.alertDeliveryMethod === 'in-app' && (
                <p className="text-xs text-gray-500 mt-1 pl-7">In-app notifications will appear within this dashboard.</p>
            )}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
          <Button type="button" onClick={() => { setIsEditing(false); setEnableAlerts(userProfile.enableHighVolatilityAlerts); setDeliveryMethod(userProfile.alertDeliveryMethod); }} variant="secondary">Cancel</Button>
          <Button type="button" onClick={handleSave} variant="primary">Save Alert Settings</Button>
        </div>
      )}

    </div>
  );
};

export default AlertSettingsCard;
