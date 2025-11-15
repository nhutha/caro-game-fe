'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ children, content, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionClasses = () => {
    const positions = {
      top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
      bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
      left: 'right-full mr-2 top-1/2 -translate-y-1/2',
      right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    };
    return positions[position];
  };

  const getArrowClasses = () => {
    const arrows = {
      top: 'bottom-0 translate-y-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
      bottom:
        'top-0 -translate-y-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
      left: 'left-0 translate-x-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
      right:
        'right-0 -translate-x-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
    };
    return arrows[position];
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute z-50 ${getPositionClasses()} bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg pointer-events-none`}
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 border-gray-900 dark:border-gray-700 ${getArrowClasses()}`}
          />
        </div>
      )}
    </div>
  );
}

export function TooltipGroup({ children }: { children: ReactNode }) {
  return <div className="inline-flex gap-1">{children}</div>;
}
