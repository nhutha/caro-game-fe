'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Caro Game
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 dark:text-gray-300">
                    Welcome, {user?.username || 'User'}!
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link
                    href="/login"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 mb-8">
            <svg className="h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Caro Game!
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Challenge your friends in the classic Tic Tac Toe strategy game
          </p>

          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ready to Play?
                </h2>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors cursor-pointer">
                    Start New Game
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors cursor-pointer">
                    Join Game
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors cursor-pointer">
                    View Game History
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Sign in or create an account to start playing
              </p>
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/register"
                  className="inline-block bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
