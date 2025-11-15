'use client';

import { ReactNode } from 'react';

interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({
  label,
  orientation = 'horizontal',
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`h-full w-px bg-gray-200 dark:bg-gray-700 ${className}`}
      />
    );
  }

  return (
    <div className={`relative my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      {label && (
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
}

export function Spacer({ size = 'md', orientation = 'vertical' }: SpacerProps) {
  const sizeMap = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const sizePixels = sizeMap[size];

  return (
    <div
      style={
        orientation === 'vertical'
          ? { height: `${sizePixels}px` }
          : { width: `${sizePixels}px` }
      }
    />
  );
}

interface StackProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
}

export function Stack({
  children,
  orientation = 'vertical',
  gap = 'md',
  align = 'start',
  justify = 'start',
  wrap = false,
  className = '',
}: StackProps) {
  const gapMap = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={`flex ${
        orientation === 'horizontal' ? 'flex-row' : 'flex-col'
      } ${gapMap[gap]} ${alignMap[align]} ${justifyMap[justify]} ${
        wrap ? 'flex-wrap' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
