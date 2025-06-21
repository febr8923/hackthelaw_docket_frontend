
import React from 'react';
import { UI_FOCUS_RING, UI_ACCENT_COLOR_CLASS } from '../../constants';

interface RadioOption {
  value: string;
  label: string | React.ReactNode;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
  legend?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange, name, legend }) => {
  const accentColor = UI_ACCENT_COLOR_CLASS; // e.g., 'primaryAccent'
  return (
    <fieldset className="mb-4">
      {legend && <legend className="text-sm font-medium text-gray-700 mb-2">{legend}</legend>}
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              className={`h-4 w-4 border-gray-400 bg-gray-100 text-${accentColor}-600 focus:ring-${accentColor}-500 ${UI_FOCUS_RING} focus:ring-offset-white cursor-pointer transition-all duration-150`}
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default RadioGroup;
