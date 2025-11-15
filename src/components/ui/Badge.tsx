'use client';

import { Star, Shield, Award, Zap } from 'lucide-react';

type BadgeVariant = 'rank' | 'achievement' | 'status' | 'highlight';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  animated?: boolean;
}

export function Badge({
  label,
  variant = 'status',
  size = 'md',
  icon,
  animated = false,
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rank':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700';
      case 'achievement':
        return 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700';
      case 'status':
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700';
      case 'highlight':
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2.5 text-base';
      case 'md':
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 ${getSizeStyles()} ${getVariantStyles()} ${
        animated ? 'animate-pulse' : ''
      }`}
    >
      {icon}
      {label}
    </span>
  );
}

interface BadgeGroupProps {
  badges: { label: string; variant?: BadgeVariant; icon?: React.ReactNode }[];
  size?: BadgeSize;
  animated?: boolean;
}

export function BadgeGroup({ badges, size = 'sm', animated = false }: BadgeGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, idx) => (
        <Badge
          key={idx}
          label={badge.label}
          variant={badge.variant}
          size={size}
          icon={badge.icon}
          animated={animated}
        />
      ))}
    </div>
  );
}

// Preset badges
export const RankBadges = {
  Diamond: <Badge label="Diamond" variant="rank" icon={<Star className="w-4 h-4" />} />,
  Platinum: <Badge label="Platinum" variant="rank" icon={<Star className="w-4 h-4" />} />,
  Gold: <Badge label="Gold" variant="rank" icon={<Star className="w-4 h-4" />} />,
  Silver: <Badge label="Silver" variant="rank" icon={<Star className="w-4 h-4" />} />,
};

export const AchievementBadges = {
  FirstWin: <Badge label="First Win" variant="achievement" icon={<Award className="w-4 h-4" />} />,
  FireStreak: (
    <Badge label="Fire Streak" variant="achievement" icon={<Zap className="w-4 h-4" />} />
  ),
  Defender: <Badge label="Defender" variant="achievement" icon={<Shield className="w-4 h-4" />} />,
};
