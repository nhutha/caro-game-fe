'use client';

import { Room } from '@/types';
import { Users, Shield, ChevronRight } from 'lucide-react';

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

  return (
    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

      {/* Content */}
      <div className="relative p-5 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-blue-400 transition-colors">
              {room.name}
            </h3>
            <div className="flex items-center text-sm text-slate-400 gap-2">
              <Shield className="w-4 h-4" />
              <span className="truncate">Master: {room.master.username}</span>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                isFull
                  ? 'bg-red-500/20 text-red-300'
                  : playerCount === 1
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-green-500/20 text-green-300'
              }`}
            >
              <Users className="w-3 h-3" />
              {playerCount}/{maxPlayers}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isFull ? 'bg-red-500' : playerCount === 1 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>

        {/* Room info */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-slate-400">
          <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded border border-slate-700">
            <span>Room ID:</span>
            <span className="font-mono text-slate-300 truncate ml-2">{room.id.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded border border-slate-700">
            <span>Status:</span>
            <span
              className={`font-semibold ${
                isFull ? 'text-red-400' : playerCount === 1 ? 'text-yellow-400' : 'text-green-400'
              }`}
            >
              {isFull ? 'Full' : playerCount === 1 ? 'Waiting' : 'Available'}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => onJoin(room.id)}
          disabled={isFull || isLoading}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            isFull || isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin">⌛</div>
              Joining...
            </>
          ) : isFull ? (
            <>
              <span>Room Full</span>
            </>
          ) : (
            <>
              <span>Join Game</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Decorative border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-transparent to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-lg" />
    </div>
  );
}
