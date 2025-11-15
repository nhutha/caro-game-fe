'use client';

import { Trophy, TrendingUp, Flame, Target, Users } from 'lucide-react';

interface StatsOverviewProps {
  totalPlayers?: number;
  totalGames?: number;
  averageRating?: number;
  topPlayer?: string;
}

export function StatsOverview({
  totalPlayers = 156,
  totalGames = 2840,
  averageRating = 2450,
  topPlayer = 'ProGamer',
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Players */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Players</p>
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">{totalPlayers}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Active in community</p>
      </div>

      {/* Total Games */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Games</p>
          <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
          {totalGames}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Matches played</p>
      </div>

      {/* Average Rating */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
          {averageRating}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Community average</p>
      </div>

      {/* Top Player */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Player</p>
          <Flame className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mb-1 truncate">
          {topPlayer}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Leaderboard champion</p>
      </div>
    </div>
  );
}
