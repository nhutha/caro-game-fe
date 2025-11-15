'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';
import { Trophy, Clock, TrendingUp, BarChart3 } from 'lucide-react';

interface GameRecord {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  date: string;
  duration: string;
  ratingChange: number;
  moves: number;
}

const MOCK_GAMES: GameRecord[] = [
  {
    id: '1',
    opponent: 'ProGamer',
    result: 'win',
    date: '2024-01-20T15:30:00',
    duration: '12m 45s',
    ratingChange: +42,
    moves: 78,
  },
  {
    id: '2',
    opponent: 'ChessKing',
    result: 'loss',
    date: '2024-01-20T14:15:00',
    duration: '8m 22s',
    ratingChange: -15,
    moves: 56,
  },
  {
    id: '3',
    opponent: 'StrategyMaster',
    result: 'win',
    date: '2024-01-20T13:00:00',
    duration: '18m 11s',
    ratingChange: +38,
    moves: 95,
  },
  {
    id: '4',
    opponent: 'QuickThink',
    result: 'win',
    date: '2024-01-19T22:45:00',
    duration: '5m 33s',
    ratingChange: +28,
    moves: 34,
  },
  {
    id: '5',
    opponent: 'MindGames',
    result: 'draw',
    date: '2024-01-19T20:30:00',
    duration: '21m 15s',
    ratingChange: 0,
    moves: 125,
  },
  {
    id: '6',
    opponent: 'CalmCombat',
    result: 'loss',
    date: '2024-01-19T18:20:00',
    duration: '9m 47s',
    ratingChange: -8,
    moves: 61,
  },
  {
    id: '7',
    opponent: 'RisingTide',
    result: 'win',
    date: '2024-01-19T16:00:00',
    duration: '11m 22s',
    ratingChange: +25,
    moves: 72,
  },
  {
    id: '8',
    opponent: 'GameHunter',
    result: 'win',
    date: '2024-01-18T19:30:00',
    duration: '7m 56s',
    ratingChange: +31,
    moves: 49,
  },
  {
    id: '9',
    opponent: 'StealthPlay',
    result: 'loss',
    date: '2024-01-18T17:15:00',
    duration: '13m 44s',
    ratingChange: -22,
    moves: 88,
  },
  {
    id: '10',
    opponent: 'LuckyStrike',
    result: 'win',
    date: '2024-01-18T15:00:00',
    duration: '10m 18s',
    ratingChange: +35,
    moves: 67,
  },
];

export default function GameHistoryPage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss' | 'draw'>('all');

  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingData(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <SkeletonTable rows={10} columns={6} />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter games
  const filteredGames =
    filterResult === 'all' ? MOCK_GAMES : MOCK_GAMES.filter((game) => game.result === filterResult);

  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

  // Calculate stats
  const stats = {
    wins: MOCK_GAMES.filter((g) => g.result === 'win').length,
    losses: MOCK_GAMES.filter((g) => g.result === 'loss').length,
    draws: MOCK_GAMES.filter((g) => g.result === 'draw').length,
    totalGames: MOCK_GAMES.length,
    totalRatingChange: MOCK_GAMES.reduce((sum, g) => sum + g.ratingChange, 0),
    avgGameDuration: calculateAverageGameDuration(),
  };

  function calculateAverageGameDuration() {
    const totalSeconds = MOCK_GAMES.reduce((sum, game) => {
      const [min, sec] = game.duration.split('m ').join('').split('s');
      return sum + parseInt(min) * 60 + parseInt(sec);
    }, 0);
    const avgSeconds = Math.round(totalSeconds / MOCK_GAMES.length);
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = avgSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'loss':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'draw':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getRatingChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-600 dark:text-emerald-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Game History</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View your recent games and track your performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">
              Total Games
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalGames}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
              Wins
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.wins}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1">
              Losses
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.losses}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold mb-1">
              Draws
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.draws}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div
              className={`text-xs font-semibold mb-1 ${getRatingChangeColor(stats.totalRatingChange)}`}
            >
              Rating Change
            </div>
            <div className={`text-2xl font-bold ${getRatingChangeColor(stats.totalRatingChange)}`}>
              {stats.totalRatingChange > 0 ? '+' : ''} {stats.totalRatingChange}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">
              Avg Duration
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgGameDuration}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex gap-2">
          {(['all', 'win', 'loss', 'draw'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setFilterResult(filter);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterResult === filter
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {filter === 'all' && `All (${MOCK_GAMES.length})`}
              {filter === 'win' && `Wins (${stats.wins})`}
              {filter === 'loss' && `Losses (${stats.losses})`}
              {filter === 'draw' && `Draws (${stats.draws})`}
            </button>
          ))}
        </div>

        {/* Games Table - Desktop */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Opponent
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Result
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Moves
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Rating Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedGames.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/game/${game.id}`)}
                  >
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {new Date(game.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={game.opponent} size="sm" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {game.opponent}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        label={game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                        variant={
                          game.result === 'win' ? 'rank' : game.result === 'loss' ? 'achievement' : 'status'
                        }
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {game.duration}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {game.moves}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-bold ${getRatingChangeColor(game.ratingChange)}`}>
                      {game.ratingChange > 0 ? '+' : ''} {game.ratingChange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Games Cards - Mobile */}
        <div className="md:hidden space-y-3 mb-8">
          {paginatedGames.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/game/${game.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(game.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <Badge
                  label={game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                  variant={
                    game.result === 'win' ? 'rank' : game.result === 'loss' ? 'achievement' : 'status'
                  }
                  size="sm"
                />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <Avatar name={game.opponent} size="sm" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{game.opponent}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{game.duration} • {game.moves} moves</p>
                </div>
                <div className={`text-right font-bold text-sm ${getRatingChangeColor(game.ratingChange)}`}>
                  {game.ratingChange > 0 ? '+' : ''} {game.ratingChange}
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

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
}
