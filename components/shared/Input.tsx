
import React, { InputHTMLAttributes } from 'react';
import { UI_FOCUS_RING, UI_BORDER_ACCENT } from '../../constants';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  wrapperClassName?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, type = "text", wrapperClassName = "", icon, className="", ...props }) => {
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:${UI_BORDER_ACCENT} ${UI_FOCUS_RING} sm:text-sm transition-colors duration-150 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
