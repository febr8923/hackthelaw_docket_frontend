
import React from 'react';
import { UI_BUTTON_PRIMARY_BG, UI_BUTTON_PRIMARY_TEXT, UI_BUTTON_SECONDARY_BG, UI_BUTTON_SECONDARY_TEXT, UI_FOCUS_RING, UI_TEXT_ACCENT } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  leftIcon,
  rightIcon,
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all duration-150 ease-in-out";
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = `${UI_BUTTON_PRIMARY_BG} ${UI_BUTTON_PRIMARY_TEXT} ${UI_FOCUS_RING}`;
      break;
    case 'secondary':
      variantStyles = `${UI_BUTTON_SECONDARY_BG} ${UI_BUTTON_SECONDARY_TEXT} ${UI_FOCUS_RING.replace('primaryAccent', 'secondaryAccent')} focus:ring-secondaryAccent-500`; // Use secondary accent for focus ring on secondary buttons
      break;
    case 'link':
      variantStyles = `${UI_TEXT_ACCENT} hover:text-primaryAccent-700 shadow-none ${UI_FOCUS_RING}`; // Link uses primary accent
      break;
  }

  let sizeStyles = '';
  switch(size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-5 py-2.5 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-8 py-3 text-lg';
      break;
  }

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
    </button>
  );
};

export default Button;
