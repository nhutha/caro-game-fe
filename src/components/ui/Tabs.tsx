'use client';

import React, { ReactNode } from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills';
}

export function Tabs({ items, defaultTab, onChange, variant = 'underline' }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || items[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeItem = items.find((item) => item.id === activeTab);

  const getTabStyles = (isActive: boolean, disabled?: boolean) => {
    if (disabled) return 'opacity-50 cursor-not-allowed';

    if (variant === 'pills') {
      return isActive
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
    }

    return isActive
      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent';
  };

  return (
    <div>
      <div
        className={`flex gap-2 ${
          variant === 'underline' ? 'border-b border-gray-200 dark:border-gray-700' : ''
        }`}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            disabled={item.disabled}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 rounded-t-lg ${getTabStyles(
              activeTab === item.id,
              item.disabled
            )} ${variant === 'pills' ? 'rounded-lg px-4 py-2 mt-0' : ''}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeItem && (
          <div className="animate-in fade-in-50 duration-200">{activeItem.content}</div>
        )}
      </div>
    </div>
  );
}
