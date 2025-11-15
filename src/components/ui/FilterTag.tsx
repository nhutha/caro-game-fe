'use client';

import { X } from 'lucide-react';

interface FilterTagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'status' | 'category' | 'default';
  onRemove?: () => void;
}

export function FilterTag({
  label,
  isActive,
  onClick,
  variant = 'default',
  onRemove,
}: FilterTagProps) {
  const getStyles = () => {
    if (isActive) {
      if (variant === 'status') {
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 dark:border-indigo-500';
      }
      return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700';
    }

    return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600';
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${getStyles()}`}
    >
      {label}
      {onRemove && isActive && (
        <X
          className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}

interface FilterTagGroupProps {
  tags: string[];
  activeTag: string;
  onChange: (tag: string) => void;
  variant?: 'status' | 'category' | 'default';
}

export function FilterTagGroup({
  tags,
  activeTag,
  onChange,
  variant = 'default',
}: FilterTagGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <FilterTag
          key={tag}
          label={tag}
          isActive={activeTag === tag}
          onClick={() => onChange(tag)}
          variant={variant}
        />
      ))}
    </div>
  );
}
