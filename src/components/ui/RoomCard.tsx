'use client';

import { Room } from '@/types';
import { Users, Shield, ChevronRight, Zap } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  playerCount: number;
  maxPlayers?: number;
  onJoin: (roomId: string) => void;
  isLoading?: boolean;
}

export function RoomCard({
  room,
  playerCount,
  maxPlayers = 2,
  onJoin,
  isLoading = false,
}: RoomCardProps) {
  const isFull = playerCount >= maxPlayers;
  const occupancyPercentage = (playerCount / maxPlayers) * 100;

  const getStatusColor = () => {
    if (isFull)
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    if (playerCount === 1)
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  };

  const getProgressColor = () => {
    if (isFull) return 'bg-red-500';
    if (playerCount === 1) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getButtonColor = () => {
    if (isFull || isLoading)
      return 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed';
    return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/50';
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:shadow-lg dark:hover:shadow-indigo-500/20 hover:-translate-y-1">
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

      {/* Content */}
      <div className="relative p-5 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {room.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span className="truncate">Master: {room.master.username}</span>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 border transition-all ${getStatusColor()}`}
            >
              <Users className="w-3 h-3" />
              <span>
                {playerCount}/{maxPlayers}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 space-y-2">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {isFull ? 'Room Full' : playerCount === 1 ? 'Waiting for opponent' : 'Ready to play'}
          </p>
        </div>

        {/* Room info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400">Room ID:</span>
            <span className="font-mono text-gray-800 dark:text-gray-200 truncate ml-2 text-xs">
              {room.id.slice(0, 6)}...
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400">Players:</span>
            <span
              className={`font-bold ${
                isFull
                  ? 'text-red-600 dark:text-red-400'
                  : playerCount === 1
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {playerCount}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => onJoin(room.id)}
          disabled={isFull || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${getButtonColor()}`}
        >
          {isLoading ? (
            <>
              <Zap className="w-4 h-4 animate-pulse" />
              Joining...
            </>
          ) : isFull ? (
            <>
              <span>Room Full</span>
            </>
          ) : (
            <>
              <span>Join Game</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
