
import React from 'react';
import { UI_FOCUS_RING, UI_ACCENT_COLOR_CLASS } from '../../constants';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, checked, onChange, ...props }) => {
  const accentColor = UI_ACCENT_COLOR_CLASS; // e.g., 'primaryAccent'
  return (
    <div className="flex items-center my-2">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-5 w-5 rounded border-gray-400 bg-gray-100 text-${accentColor}-600 focus:ring-${accentColor}-500 ${UI_FOCUS_RING} focus:ring-offset-white cursor-pointer transition-all duration-150`}
        {...props}
      />
      <label htmlFor={id} className="ml-3 block text-sm text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
