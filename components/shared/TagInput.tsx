
import React, { useState, KeyboardEvent } from 'react';
import Input from './Input';
import { ICONS, UI_ACCENT_COLOR_CLASS } from '../../constants';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  label?: string;
  id: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Tag: React.FC<{ text: string; onRemove: () => void }> = ({ text, onRemove }) => (
  <span className={`inline-flex items-center py-1 px-2.5 mr-2 mb-2 rounded-full text-sm font-medium bg-${UI_ACCENT_COLOR_CLASS}-200 text-${UI_ACCENT_COLOR_CLASS}-900`}>
    {text}
    <button
      type="button"
      onClick={onRemove}
      className={`flex-shrink-0 ml-1.5 p-0.5 rounded-full inline-flex items-center justify-center text-${UI_ACCENT_COLOR_CLASS}-700 hover:bg-${UI_ACCENT_COLOR_CLASS}-300 hover:text-${UI_ACCENT_COLOR_CLASS}-950 focus:outline-none focus:ring-1 focus:ring-${UI_ACCENT_COLOR_CLASS}-700`}
    >
      <span className="sr-only">Remove {text}</span>
      <ICONS.X_MARK className="h-3 w-3" />
    </button>
  </span>
);

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, label, id, placeholder, icon }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim() !== '') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="mb-4">
      <Input
        label={label}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder || "Add tags (press Enter or comma)"}
        icon={icon}
      />
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} onRemove={() => removeTag(tag)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
