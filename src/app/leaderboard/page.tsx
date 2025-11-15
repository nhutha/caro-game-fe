'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Leaderboard } from '@/components/ui/Leaderboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleViewProfile = (username: string) => {
    router.push(`/profile/${username}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            See the top players and track your ranking
          </p>
        </div>

        {/* Leaderboard Component */}
        <Leaderboard onViewProfile={handleViewProfile} />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-12">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 cursor-pointer"
          >
            Return Home
          </button>
          <button
            onClick={() => router.push('/browse')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 cursor-pointer"
          >
            Browse Games
          </button>
        </div>
      </main>
    </div>
  );
}
