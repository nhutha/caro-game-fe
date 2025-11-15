'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActivityTimeline } from '@/components/ui/ActivityTimeline';
import { Avatar } from '@/components/ui/Avatar';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Medal, Flame, Target, Award, Calendar, Zap } from 'lucide-react';

interface PlayerStats {
  username: string;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  totalGames: number;
  joinedDate: string;
  lastActive: string;
  highestRating: number;
  currentStreak: number;
  totalPlayTime: string;
  favoriteOpponent?: string;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
}

export default function ProfilePage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Mock player data - replace with API call
    const mockStats: PlayerStats = {
      username,
      rating: 2750,
      wins: 142,
      losses: 37,
      winRate: 79.3,
      totalGames: 179,
      joinedDate: '2024-01-15',
      lastActive: '30 minutes ago',
      highestRating: 2850,
      currentStreak: 12,
      totalPlayTime: '245 hours',
      favoriteOpponent: 'ProGamer',
      achievements: [
        {
          id: '1',
          name: 'First Win',
          description: 'Win your first game',
          icon: '🏆',
          unlockedDate: '2024-01-20',
        },
        {
          id: '2',
          name: 'Streak Master',
          description: 'Win 10 consecutive games',
          icon: '🔥',
          unlockedDate: '2024-03-10',
        },
        {
          id: '3',
          name: 'Century Club',
          description: 'Reach 100 wins',
          icon: '💯',
          unlockedDate: '2024-05-22',
        },
        {
          id: '4',
          name: 'Rating Climber',
          description: 'Reach 2500 rating',
          icon: '📈',
          unlockedDate: '2024-06-15',
        },
      ],
    };
    setPlayerStats(mockStats);
    setIsLoadingStats(false);
  }, [username]);

  if (isLoading || isLoadingStats) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !playerStats) {
    return null;
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 2700) return 'text-emerald-600 dark:text-emerald-400';
    if (rating >= 2500) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 2300) return 'text-indigo-600 dark:text-indigo-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 2700) return 'bg-emerald-100 dark:bg-emerald-900/30';
    if (rating >= 2500) return 'bg-blue-100 dark:bg-blue-900/30';
    if (rating >= 2300) return 'bg-indigo-100 dark:bg-indigo-900/30';
    return 'bg-gray-100 dark:bg-gray-900/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-32" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  name={playerStats.username}
                  size="xl"
                  variant="gradient"
                />
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {playerStats.username}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined{' '}
                  {new Date(playerStats.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>

              {/* Main Stats */}
              <div className="flex gap-4">
                <div
                  className={`p-4 rounded-lg border-2 ${getRatingBg(playerStats.rating)} ${getRatingColor(playerStats.rating)} border-current/20`}
                >
                  <p className="text-xs font-semibold opacity-75 mb-1">Rating</p>
                  <p className="text-3xl font-bold">{playerStats.rating}</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-600/20">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-75 mb-1">
                    Win Rate
                  </p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                    {playerStats.winRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <Trophy className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Wins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {playerStats.wins}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <Medal className="w-5 h-5 mx-auto mb-2 text-red-500" />
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Losses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {playerStats.losses}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <Flame className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {playerStats.currentStreak}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <Zap className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
                  Total Games
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {playerStats.totalGames}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'achievements'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Achievements ({playerStats.achievements.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Performance
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Highest Rating</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {playerStats.highestRating}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{
                          width: `${(playerStats.highestRating / 3000) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Current Rating</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {playerStats.rating}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{
                          width: `${(playerStats.rating / 3000) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Activity
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Last Active</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {playerStats.lastActive}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Total Play Time</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {playerStats.totalPlayTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {playerStats.currentStreak} wins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Match Statistics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Games</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {playerStats.totalGames}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Wins</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {playerStats.wins}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Losses</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {playerStats.losses}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Win Rate</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {playerStats.winRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playerStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Unlocked{' '}
                      {new Date(achievement.unlockedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Recent Activity
          </h2>
          <ActivityTimeline />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-12">
          <button
            onClick={() => router.push('/leaderboard')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 cursor-pointer"
          >
            Back to Leaderboard
          </button>
          <button
            onClick={() => router.push('/browse')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 cursor-pointer"
          >
            Challenge Player
          </button>
        </div>
      </main>
    </div>
  );
}
