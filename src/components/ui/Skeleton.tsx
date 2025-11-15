'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  count?: number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  count = 1,
}: SkeletonProps) {
  const getVariantClasses = () => {
    const variants = {
      text: 'h-6 rounded',
      circular: 'h-12 w-12 rounded-full',
      rectangular: 'h-12 rounded',
    };
    return variants[variant];
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse ${getVariantClasses()} ${className} ${
            count > 1 ? 'mb-4' : ''
          }`}
        />
      ))}
    </>
  );
}

interface SkeletonCardProps {
  count?: number;
  lines?: number;
}

export function SkeletonCard({ count = 1, lines = 3 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <Skeleton variant="rectangular" className="h-8 w-1/2" />
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, lineIdx) => (
              <Skeleton
                key={lineIdx}
                variant="text"
                className={lineIdx === lines - 1 ? 'w-2/3' : 'w-full'}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className="p-4">
                <Skeleton variant="text" className="w-20 h-4" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="p-4">
                  <Skeleton variant="text" className="w-24 h-4" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
