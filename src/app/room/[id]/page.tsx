'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room, User } from '@/types';
import apolloClient from '@/lib/apollo';
import { gql } from '@apollo/client';
import { Shield, Users, ArrowLeft, Loader2 } from 'lucide-react';

const GET_ROOM = gql`
  query GetRoom($roomId: ID!) {
    room(roomId: $roomId) {
      id
      name
      createdAt
      master {
        id
        username
        email
      }
      guest {
        id
        username
        email
      }
    }
  }
`;

interface GetRoomResponse {
  room: Room;
}

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const result = await apolloClient.query<GetRoomResponse>({
          query: GET_ROOM,
          variables: { roomId: resolvedParams.id },
          fetchPolicy: 'network-only',
        });

        setRoom(result.data?.room || null);
      } catch (err: any) {
        console.error('Error fetching room:', err);
        setError(err.message || 'Failed to load room');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchRoom();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Room Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The room you are looking for does not exist.'}
          </p>
          <button
            onClick={() => router.push('/browse')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const playerCount = room.guest ? 2 : 1;
  const isWaiting = !room.guest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/browse')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Browse
        </button>

        {/* Room header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {room.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Room ID: <span className="font-mono">{room.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-indigo-900 dark:text-indigo-300">
                {playerCount}/2 Players
              </span>
            </div>
          </div>

          {/* Waiting status */}
          {isWaiting && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium text-center">
                ⏳ Waiting for opponent to join...
              </p>
            </div>
          )}

          {/* Players grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Master player */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Room Master
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {room.master.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {room.master.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {room.master.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest player or empty slot */}
            <div className={`rounded-lg p-6 border-2 ${
              room.guest
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-gray-50 dark:bg-gray-900/20 border-dashed border-gray-300 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Users className={`w-6 h-6 ${
                  room.guest
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-600'
                }`} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Guest Player
                </h3>
              </div>
              {room.guest ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                    {room.guest.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {room.guest.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {room.guest.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    Waiting for player to join...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex gap-4">
            {!isWaiting && (
              <button className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-emerald-500/50 text-lg">
                🎮 Start Game
              </button>
            )}
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Game board placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Game Board
          </h2>
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {isWaiting
                ? 'Waiting for opponent to start the game...'
                : 'Game board will appear here once the game starts'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
