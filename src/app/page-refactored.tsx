'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@apollo/client/react';
import { CREATE_ROOM } from '@/lib/graphql/mutations';
import { useEffect, useState } from 'react';
import createCableConsumer from '@/lib/actioncable';
import { CreateRoomResponse, Room, GamePlayer } from '@/types';
import { Navbar } from '@/components/ui/Navbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CreateRoomModal } from '@/components/modals/CreateRoomModal';
import { GameBoard } from '@/components/game/GameBoard';
import { PlayerInfo } from '@/components/game/PlayerInfo';
import { useBodyOverflow } from '@/hooks/useBodyOverflow';
import { createMockOpponent } from '@/utils/gameUtils';

export default function Home() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<{ X: GamePlayer | null; O: GamePlayer | null }>({
    X: null,
    O: null,
  });
  const [boardState, setBoardState] = useState<(string | null)[]>(Array(225).fill(null));
  const [currentTurn, setCurrentTurn] = useState<'X' | 'O'>('X');

  const [createRoom, { loading: createRoomLoading }] = useMutation<CreateRoomResponse>(
    CREATE_ROOM,
    {
      onCompleted: (data: CreateRoomResponse) => {
        const roomData = data.createRoom.room;
        setRoom(roomData);
        setShowCreateRoomModal(false);

        setPlayers({
          X: { ...roomData.master, symbol: 'X' },
          O: createMockOpponent(),
        });
        setGameStarted(true);
      },
      onError: (error: Error) => {
        console.error('Create room error:', error);
        alert('Failed to create room: ' + error.message);
      },
    }
  );

  // Setup ActionCable subscription
  useEffect(() => {
    if (!isAuthenticated || !room?.id || typeof window === 'undefined') return;

    const cable = createCableConsumer();
    const sub = cable.subscriptions.create(
      {
        channel: 'GraphqlChannel',
        room_id: room.id,
      },
      {
        received(data: { game?: string; status?: string; move?: unknown }) {
          console.log('Room updated via ActionCable:', data);
          alert(`Room Update Received!\n${JSON.stringify(data, null, 2)}`);
        },
        connected() {
          console.log('Connected to GraphqlChannel for room:', room.id);
        },
        disconnected() {
          console.log('Disconnected from GraphqlChannel');
        },
      }
    );

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [isAuthenticated, room?.id]);

  // Control body overflow
  useBodyOverflow(showCreateRoomModal);

  const handleCreateNewRoom = async () => {
    try {
      await createRoom({
        variables: {
          input: {
            name: roomName || `Room by ${user?.username || 'User'} - ${new Date().toLocaleTimeString()}`,
          },
        },
      });
      setRoomName('');
    } catch (err) {
      console.error('Error creating room:', err);
    }
  };

  const handleCellClick = (index: number) => {
    if (!gameStarted || !players.X || !players.O) return;

    const currentUserSymbol = user?.id === players.X.id ? 'X' : 'O';
    const isCurrentUserTurn = currentTurn === currentUserSymbol;

    if (boardState[index] === null && isCurrentUserTurn) {
      const newBoard = [...boardState];
      newBoard[index] = currentUserSymbol;
      setBoardState(newBoard);
      setCurrentTurn(currentUserSymbol === 'X' ? 'O' : 'X');
    }
  };

  const handleLeaveRoom = () => {
    setGameStarted(false);
    setRoom(null);
    setPlayers({ X: null, O: null });
    setBoardState(Array(225).fill(null));
    setCurrentTurn('X');
  };

  const handleCreateRoomModalClose = () => {
    setShowCreateRoomModal(false);
    setRoomName('');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Game started screen
  if (gameStarted && room && players.X && players.O) {
    const currentUserSymbol = user?.id === players.X.id ? 'X' : 'O';
    const isCurrentUserTurn = currentTurn === currentUserSymbol;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar
          username={user?.username}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />

        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Room Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {room.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Game ID: {room.id.slice(0, 8)}...</p>
          </div>

          {/* Players Info */}
          <div className="flex gap-4 mb-8">
            <PlayerInfo
              player={players.X}
              isCurrentTurn={currentTurn === 'X'}
              isCurrentPlayer={currentUserSymbol === 'X'}
            />
            <div className="text-gray-600 dark:text-gray-400 font-semibold flex items-center">
              VS
            </div>
            <PlayerInfo
              player={players.O}
              isCurrentTurn={currentTurn === 'O'}
              isCurrentPlayer={currentUserSymbol === 'O'}
            />
          </div>

          {/* Game Board */}
          <GameBoard
            boardState={boardState}
            isCurrentUserTurn={isCurrentUserTurn}
            onCellClick={handleCellClick}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={handleLeaveRoom}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors cursor-pointer"
            >
              Leave Room
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Home screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar
        username={user?.username}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 mb-8">
            <svg
              className="h-12 w-12 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
                  <button
                    onClick={() => setShowCreateRoomModal(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create New Room
                  </button>

                  {room && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Current Room:
                      </h3>
                      <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                        <p>
                          <strong>ID:</strong> {room.id}
                        </p>
                        <p>
                          <strong>Name:</strong> {room.name}
                        </p>
                        <p>
                          <strong>Master:</strong> {room.master.username} ({room.master.email})
                        </p>
                      </div>
                    </div>
                  )}

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

      <CreateRoomModal
        isOpen={showCreateRoomModal}
        roomName={roomName}
        isLoading={createRoomLoading}
        onRoomNameChange={setRoomName}
        onCreateRoom={handleCreateNewRoom}
        onClose={handleCreateRoomModalClose}
      />
    </div>
  );
}
