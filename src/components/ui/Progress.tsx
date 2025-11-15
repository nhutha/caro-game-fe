'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'emerald' | 'red' | 'yellow' | 'purple' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  striped?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'blue',
  size = 'md',
  showLabel = true,
  animated = true,
  striped = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClasses = () => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      emerald: 'from-emerald-500 to-emerald-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      indigo: 'from-indigo-500 to-indigo-600',
    };
    return colors[color];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };
    return sizes[size];
  };

  return (
    <div className="w-full">
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${getSizeClasses()}`}
      >
        <div
          className={`h-full bg-gradient-to-r ${getColorClasses()} rounded-full transition-all duration-500 ${
            animated ? 'animate-pulse' : ''
          } ${striped ? 'bg-stripes' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {value} / {max} ({percentage.toFixed(1)}%)
        </p>
      )}
    </div>
  );
}

interface CircleProgressProps {
  value: number;
  max?: number;
  size?: number;
  color?: 'blue' | 'emerald' | 'red' | 'yellow' | 'purple' | 'indigo';
  showLabel?: boolean;
}

export function CircleProgress({
  value,
  max = 100,
  size = 100,
  color = 'blue',
  showLabel = true,
}: CircleProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColorClass = () => {
    const colors = {
      blue: 'stroke-blue-500',
      emerald: 'stroke-emerald-500',
      red: 'stroke-red-500',
      yellow: 'stroke-yellow-500',
      purple: 'stroke-purple-500',
      indigo: 'stroke-indigo-500',
    };
    return colors[color];
  };

  return (
    <div className="flex flex-col items-center">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${getColorClass()} transition-all duration-500`}
          />
        </svg>
        {showLabel && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {value}/{max}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center flex-1">
          {/* Step circle */}
          <button
            onClick={() => onStepClick?.(idx)}
            className={`flex-shrink-0 w-10 h-10 rounded-full border-2 font-semibold transition-all flex items-center justify-center cursor-pointer ${
              idx < currentStep
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : idx === currentStep
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
            }`}
          >
            {idx < currentStep ? '✓' : idx + 1}
          </button>

          {/* Connector line */}
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                idx < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
