
import React from 'react';
import Button from '../shared/Button';
import { ICONS, UI_TEXT_ACCENT, UI_ACCENT_COLOR_CLASS } from '../../constants';

interface WelcomeStepProps {
  onGetStarted: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onGetStarted }) => {
  return (
    <div className="text-center py-10 px-4 flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl">
      <div className="mb-8">
        <svg className={`w-24 h-24 text-${UI_ACCENT_COLOR_CLASS}-500 animate-pulse-gentle mx-auto`} viewBox="0 0 24 24" fill="currentColor">
          {/* Abstract legal/knowledge icon */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      </div>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
        Smart legal updates,
        <br />
        <span className={`${UI_TEXT_ACCENT}`}>straight to your inbox.</span>
      </h2>
      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto">
        Personalized legal & industry insights, delivered with precision.
      </p>
      <Button 
        onClick={onGetStarted} 
        variant="primary" 
        size="lg"
        rightIcon={<ICONS.ARROW_RIGHT className="w-5 h-5" />}
        className="transform hover:scale-105"
      >
        Get Started
      </Button>
    </div>
  );
};

export default WelcomeStep;
