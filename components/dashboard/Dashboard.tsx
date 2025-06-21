
import React, { useState } from 'react';
import { UserProfile, DigestSummary } from '../../types';
import { APP_NAME, MOCK_PAST_DIGESTS, ICONS, UI_ACCENT_COLOR_CLASS, UI_SECONDARY_ACCENT_COLOR_CLASS } from '../../constants';
import PreferencesCard from './PreferencesCard';
import AlertSettingsCard from './AlertSettingsCard';
import PastDigestsCard from './PastDigestsCard';
import { SVGIconProps } from '../icons/HeroIcons'; 

interface DashboardProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, updateProfile }) => {
  const [activeSection, setActiveSection] = useState<'preferences' | 'alerts' | 'digests'>('preferences');
  
  const pastDigests: DigestSummary[] = MOCK_PAST_DIGESTS;

  const renderSection = () => {
    switch(activeSection) {
      case 'preferences':
        return <PreferencesCard userProfile={userProfile} updateProfile={updateProfile} />;
      case 'alerts':
        return <AlertSettingsCard userProfile={userProfile} updateProfile={updateProfile} />;
      case 'digests':
        return <PastDigestsCard digests={pastDigests} />;
      default:
        return <PreferencesCard userProfile={userProfile} updateProfile={updateProfile} />;
    }
  };

  const NavButton: React.FC<{ section: 'preferences' | 'alerts' | 'digests'; label: string; icon: React.ReactElement<SVGIconProps> }> = ({ section, label, icon }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-150 group
                  ${activeSection === section 
                    ? `bg-${UI_ACCENT_COLOR_CLASS}-600 text-white shadow-md` 
                    : `text-gray-700 hover:bg-${UI_ACCENT_COLOR_CLASS}-100 hover:text-${UI_ACCENT_COLOR_CLASS}-700`}`}
    >
      {React.cloneElement(icon, { className: `w-5 h-5 mr-3 flex-shrink-0 ${activeSection === section ? 'text-white' : `text-gray-500 group-hover:text-${UI_ACCENT_COLOR_CLASS}-600`}` })}
      <span className="truncate">{label}</span>
    </button>
  );
  
  const headerHeight = 'h-[68px]'; // Approx 4.25rem, for p-4 sm:p-6. Adjust if needed.

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 flex flex-col selection:bg-${UI_ACCENT_COLOR_CLASS}-500 selection:text-white`}>
      <header className={`bg-white shadow-md p-4 sm:p-6 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200 ${headerHeight}`}>
        <div className="flex items-center">
          <img src="/logo.png" alt={`${APP_NAME} logo`} className="h-8 sm:h-9 w-auto" />
          <span className="text-xl sm:text-2xl font-serif font-semibold text-gray-800 ml-3 hidden md:inline">Dashboard</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {userProfile.fullName.split(' ')[0]}!</span>
          <button className={`p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-${UI_ACCENT_COLOR_CLASS}-500 focus:ring-offset-2 focus:ring-offset-white`} title="Account Settings">
            <ICONS.USER_CIRCLE className="w-7 h-7 text-gray-500" />
          </button>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row">
        <nav 
          className="md:w-64 bg-white p-4 space-y-2 border-r border-gray-200 shadow-sm md:sticky overflow-y-auto"
          style={{ top: `calc(${headerHeight})`, height: `calc(100vh - ${headerHeight})` }} // Dynamically set top and height
        >
          <NavButton section="preferences" label="My Preferences" icon={<ICONS.COG_6_TOOTH />} />
          <NavButton section="alerts" label="Alert Settings" icon={<ICONS.BELL />} />
          <NavButton section="digests" label="Past Digests" icon={<ICONS.EYE />} />
        </nav>

        <main className="flex-grow p-6 sm:p-8 lg:p-10 overflow-y-auto bg-gray-50">
          <div className="animate-fadeIn">
            {renderSection()}
          </div>
        </main>
      </div>
      
      <footer className="text-center text-gray-500 p-4 text-sm border-t border-gray-200 bg-white">
        &copy; {new Date().getFullYear()} {APP_NAME}. For demonstration purposes.
      </footer>
    </div>
  );
};

export default Dashboard;
