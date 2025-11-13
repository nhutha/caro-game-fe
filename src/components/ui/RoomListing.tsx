'use client';

import { useState } from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';
import { Search, RefreshCw, Plus, Filter } from 'lucide-react';

interface RoomListingProps {
  rooms?: Room[];
  isLoading?: boolean;
  onJoinRoom?: (roomId: string) => void;
  onCreateRoom?: () => void;
  onRefresh?: () => void;
}

export function RoomListing({
  rooms = [],
  isLoading = false,
  onJoinRoom = () => {},
  onCreateRoom = () => {},
  onRefresh = () => {},
}: RoomListingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'waiting' | 'full'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'players' | 'name'>('recent');
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // Mock data for demonstration
  const mockRooms: Room[] = [
    {
      id: '1a2b3c4d5e6f7g8h',
      name: '🎮 Beginner Match',
      master: {
        id: 'user1',
        username: 'AlexPlayer',
        email: 'alex@example.com',
      },
    },
    {
      id: '2b3c4d5e6f7g8h9i',
      name: '⚡ Fast Paced Game',
      master: {
        id: 'user2',
        username: 'SpeedRunner',
        email: 'speed@example.com',
      },
    },
    {
      id: '3c4d5e6f7g8h9i0j',
      name: '🏆 Championship Round',
      master: {
        id: 'user3',
        username: 'ProGamer',
        email: 'pro@example.com',
      },
    },
    {
      id: '4d5e6f7g8h9i0j1k',
      name: '🌟 Friendly Match',
      master: {
        id: 'user4',
        username: 'CasualPlayer',
        email: 'casual@example.com',
      },
    },
  ];

  const displayRooms = rooms.length > 0 ? rooms : mockRooms;

  // Mock player counts
  const getPlayerCount = (roomId: string) => {
    const counts: { [key: string]: number } = {
      '1a2b3c4d5e6f7g8h': 1,
      '2b3c4d5e6f7g8h9i': 2,
      '3c4d5e6f7g8h9i0j': 2,
      '4d5e6f7g8h9i0j1k': 1,
    };
    return counts[roomId] || 1;
  };

  // Filter rooms
  let filteredRooms = displayRooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.master.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;

    const playerCount = getPlayerCount(room.id);
    if (filterStatus === 'available') return playerCount < 2;
    if (filterStatus === 'waiting') return playerCount === 1;
    if (filterStatus === 'full') return playerCount >= 2;

    return true;
  });

  // Sort rooms
  filteredRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'players') {
      return getPlayerCount(b.id) - getPlayerCount(a.id);
    }
    // 'recent' - maintain original order
    return 0;
  });

  const handleJoinRoom = async (roomId: string) => {
    setJoiningRoomId(roomId);
    try {
      onJoinRoom(roomId);
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setJoiningRoomId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Browse Games</h1>
          <p className="text-slate-400 text-lg">
            Join an existing room or create your own Caro match
          </p>
        </div>

        {/* Controls section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search bar */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search rooms by name or player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Create room button */}
          <button
            onClick={onCreateRoom}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Room
          </button>
        </div>

        {/* Filter and sort options */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Filter:</span>
            </div>
            {(['all', 'available', 'waiting', 'full'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {status === 'all' && 'All Rooms'}
                {status === 'available' && 'Available'}
                {status === 'waiting' && 'Waiting'}
                {status === 'full' && 'Full'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 text-sm focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="recent">Recent</option>
                <option value="players">Most Players</option>
                <option value="name">Room Name</option>
              </select>
            </div>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50"
              title="Refresh room list"
            >
              <RefreshCw className={`w-5 h-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Rooms grid or empty state */}
        {isLoading && !displayRooms.length ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin mb-4">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full" />
              </div>
              <p className="text-slate-400 text-lg">Loading rooms...</p>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-slate-400 text-lg mb-4">
                {searchQuery || filterStatus !== 'all'
                  ? 'No rooms found matching your criteria'
                  : 'No rooms available yet'}
              </p>
              <button
                onClick={onCreateRoom}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create First Room
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                playerCount={getPlayerCount(room.id)}
                maxPlayers={2}
                onJoin={handleJoinRoom}
                isLoading={joiningRoomId === room.id}
              />
            ))}
          </div>
        )}

        {/* Stats footer */}
        {filteredRooms.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-blue-400">{displayRooms.length}</div>
                <div className="text-sm text-slate-400 mt-1">Total Rooms</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-green-400">
                  {displayRooms.filter((r) => getPlayerCount(r.id) < 2).length}
                </div>
                <div className="text-sm text-slate-400 mt-1">Available</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">
                  {displayRooms.filter((r) => getPlayerCount(r.id) === 1).length}
                </div>
                <div className="text-sm text-slate-400 mt-1">Waiting</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-red-400">
                  {displayRooms.filter((r) => getPlayerCount(r.id) >= 2).length}
                </div>
                <div className="text-sm text-slate-400 mt-1">Full</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
