'use client';

import { useState, useMemo } from 'react';
import { Trophy, TrendingUp, Medal, Flame } from 'lucide-react';
import { Badge } from './Badge';
import { Pagination } from './Pagination';
import { Avatar } from './Avatar';

interface LeaderboardPlayer {
  rank: number;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  totalGames: number;
  streak?: number;
  lastPlayed?: string;
}

interface LeaderboardProps {
  onViewProfile?: (username: string) => void;
  sortBy?: 'rating' | 'wins' | 'winRate';
  timeRange?: 'all' | 'week' | 'month';
}

// Mock data for demo
const MOCK_PLAYERS: LeaderboardPlayer[] = [
  {
    rank: 1,
    username: 'ProGamer',
    rating: 2850,
    wins: 156,
    losses: 24,
    winRate: 86.7,
    totalGames: 180,
    streak: 12,
    lastPlayed: '2 hours ago',
  },
  {
    rank: 2,
    username: 'ChessKing',
    rating: 2720,
    wins: 142,
    losses: 32,
    winRate: 81.6,
    totalGames: 174,
    streak: 8,
    lastPlayed: '30 mins ago',
  },
  {
    rank: 3,
    username: 'StrategyMaster',
    rating: 2650,
    wins: 128,
    losses: 38,
    winRate: 77.1,
    totalGames: 166,
    streak: 5,
    lastPlayed: '1 hour ago',
  },
  {
    rank: 4,
    username: 'QuickThink',
    rating: 2580,
    wins: 115,
    losses: 44,
    winRate: 72.3,
    totalGames: 159,
    streak: 3,
    lastPlayed: '45 mins ago',
  },
  {
    rank: 5,
    username: 'MindGames',
    rating: 2510,
    wins: 102,
    losses: 51,
    winRate: 66.7,
    totalGames: 153,
    streak: 2,
    lastPlayed: '3 hours ago',
  },
  {
    rank: 6,
    username: 'CalmCombat',
    rating: 2440,
    wins: 95,
    losses: 58,
    winRate: 62.1,
    totalGames: 153,
    streak: 1,
    lastPlayed: '1 day ago',
  },
  {
    rank: 7,
    username: 'RisingTide',
    rating: 2380,
    wins: 88,
    losses: 65,
    winRate: 57.5,
    totalGames: 153,
    streak: 0,
    lastPlayed: '2 days ago',
  },
  {
    rank: 8,
    username: 'GameHunter',
    rating: 2320,
    wins: 81,
    losses: 72,
    winRate: 52.9,
    totalGames: 153,
    streak: 1,
    lastPlayed: '4 hours ago',
  },
  {
    rank: 9,
    username: 'StealthPlay',
    rating: 2260,
    wins: 74,
    losses: 79,
    winRate: 48.4,
    totalGames: 153,
    streak: 0,
    lastPlayed: '5 hours ago',
  },
  {
    rank: 10,
    username: 'LuckyStrike',
    rating: 2200,
    wins: 67,
    losses: 86,
    winRate: 43.8,
    totalGames: 153,
    streak: 2,
    lastPlayed: 'yesterday',
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    rank: 11 + i,
    username: `Player${1100 + i}`,
    rating: 2140 - i * 60,
    wins: 60 - i * 3,
    losses: 90 + i * 4,
    winRate: 40 - i * 1.5,
    totalGames: 150 + i,
    streak: Math.max(0, 3 - i),
    lastPlayed: `${2 + i} days ago`,
  })),
];

const getRankColor = (rank: number) => {
  if (rank === 1) return 'from-yellow-400 to-yellow-600';
  if (rank === 2) return 'from-gray-300 to-gray-500';
  if (rank === 3) return 'from-orange-400 to-orange-600';
  return 'from-blue-400 to-blue-600';
};

const getRankBadge = (rank: number) => {
  if (rank <= 3) {
    const icons = [Trophy, Medal, Medal];
    const Icon = icons[rank - 1];
    return <Icon className="w-5 h-5" />;
  }
  return <span className="font-bold text-sm">#{rank}</span>;
};

export function Leaderboard({
  onViewProfile,
  sortBy = 'rating',
  timeRange = 'all',
}: LeaderboardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const itemsPerPage = 10;

  const sortedPlayers = useMemo(() => {
    const sorted = [...MOCK_PLAYERS];
    
    switch (localSortBy) {
      case 'wins':
        return sorted.sort((a, b) => b.wins - a.wins);
      case 'winRate':
        return sorted.sort((a, b) => b.winRate - a.winRate);
      case 'rating':
      default:
        return sorted.sort((a, b) => b.rating - a.rating);
    }
  }, [localSortBy]);

  const paginatedPlayers = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedPlayers.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedPlayers, currentPage]);

  const totalPages = Math.ceil(sortedPlayers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setLocalSortBy('rating')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              localSortBy === 'rating'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Rating
            </span>
          </button>
          <button
            onClick={() => setLocalSortBy('wins')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              localSortBy === 'wins'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Wins
            </span>
          </button>
          <button
            onClick={() => setLocalSortBy('winRate')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              localSortBy === 'winRate'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Win Rate
            </span>
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{sortedPlayers.length}</span>{' '}
          Players Online
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Player
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Rating
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  W/L
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Win Rate
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Streak
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Last Played
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedPlayers.map((player) => (
                <tr
                  key={player.rank}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                  onClick={() => onViewProfile?.(player.username)}
                >
                  {/* Rank */}
                  <td className="px-6 py-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${getRankColor(player.rank)} rounded-lg flex items-center justify-center text-white font-bold shadow-md`}
                    >
                      {getRankBadge(player.rank)}
                    </div>
                  </td>

                  {/* Player */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={player.username}
                        variant="default"
                        size="md"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {player.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {player.totalGames} games
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full font-bold">
                      <TrendingUp className="w-4 h-4" />
                      {player.rating}
                    </div>
                  </td>

                  {/* W/L */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {player.wins}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/{player.losses}</span>
                  </td>

                  {/* Win Rate */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                          style={{ width: `${player.winRate}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white w-12 text-right">
                        {player.winRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {player.streak && player.streak > 0 ? (
                        <Badge 
                          variant="highlight" 
                          label={`${player.streak} wins`} 
                          icon={<Flame className="w-3 h-3" />} 
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </div>
                  </td>

                  {/* Last Played */}
                  <td className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {player.lastPlayed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedPlayers.map((player) => (
          <div
            key={player.rank}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer hover:shadow-md"
            onClick={() => onViewProfile?.(player.username)}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${getRankColor(player.rank)} rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
              >
                {getRankBadge(player.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {player.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {player.totalGames} games • {player.winRate.toFixed(1)}% WR
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded font-bold text-sm">
                  <TrendingUp className="w-3 h-3" />
                  {player.rating}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                <p className="text-gray-600 dark:text-gray-400">Record</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {player.wins}W-{player.losses}L
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                <p className="text-gray-600 dark:text-gray-400">Win Rate</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  {player.winRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                <p className="text-gray-600 dark:text-gray-400">Streak</p>
                <p className="font-bold text-orange-600 dark:text-orange-400">
                  {player.streak || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}