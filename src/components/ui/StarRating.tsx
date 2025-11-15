'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const getSizeClass = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    return sizes[size];
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, idx) => {
        const ratingValue = idx + 1;
        const isFilled = ratingValue <= displayValue;

        return (
          <button
            key={idx}
            onClick={() => !readonly && onChange?.(ratingValue)}
            onMouseEnter={() => !readonly && setHoverValue(ratingValue)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            disabled={readonly}
            className={`transition-all duration-200 ${getSizeClass()} ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              className={`w-full h-full ${
                isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingDisplay({ rating, count, size = 'md' }: RatingDisplayProps) {
  const getSizeClass = () => {
    const sizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };
    return sizes[size];
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className={`${getSizeClass()} ${
              idx < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : idx < rating
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-600 dark:text-gray-400">({count})</span>
      )}
    </div>
  );
}
