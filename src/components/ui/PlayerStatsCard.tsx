'use client';

import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';

interface PlayerStatsCardProps {
  username: string;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  totalGames: number;
  onViewProfile?: () => void;
}

export function PlayerStatsCard({
  username,
  rating,
  wins,
  losses,
  winRate,
  totalGames,
  onViewProfile,
}: PlayerStatsCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 2700) return 'from-emerald-500 to-teal-500 bg-emerald-100 dark:bg-emerald-900/30';
    if (rating >= 2500) return 'from-blue-500 to-cyan-500 bg-blue-100 dark:bg-blue-900/30';
    if (rating >= 2300) return 'from-indigo-500 to-purple-500 bg-indigo-100 dark:bg-indigo-900/30';
    return 'from-gray-500 to-slate-500 bg-gray-100 dark:bg-gray-900/30';
  };

  const getRatingBorderColor = (rating: number) => {
    if (rating >= 2700) return 'border-emerald-200 dark:border-emerald-700';
    if (rating >= 2500) return 'border-blue-200 dark:border-blue-700';
    if (rating >= 2300) return 'border-indigo-200 dark:border-indigo-700';
    return 'border-gray-200 dark:border-gray-700';
  };

  return (
    <div
      onClick={onViewProfile}
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Header with gradient */}
      <div className={`h-2 bg-gradient-to-r ${getRatingColor(rating)}`} />

      <div className="p-5">
        {/* Player Name & Rating */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {username}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{totalGames} games</p>
          </div>
          <div
            className={`px-3 py-2 rounded-lg bg-gradient-to-r ${getRatingColor(rating)} border ${getRatingBorderColor(rating)}`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            <span className="font-bold">{rating}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center border border-emerald-200 dark:border-emerald-700/50">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Wins</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{wins}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center border border-red-200 dark:border-red-700/50">
            <p className="text-xs text-red-700 dark:text-red-400 font-semibold">Losses</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-400">{losses}</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center border border-indigo-200 dark:border-indigo-700/50">
            <p className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold">Rate</p>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
              {winRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Win Rate Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(winRate, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
