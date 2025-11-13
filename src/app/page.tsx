'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@apollo/client/react';
import { CREATE_ROOM } from '../lib/graphql/mutations';
import { useEffect, useState } from 'react';
import createCableConsumer from '../lib/actioncable';

interface CreateRoomResponse {
  createRoom: {
    room: {
      id: string;
      name: string;
      master: {
        id: string;
        username: string;
        email: string;
      };
    };
  };
}

interface Room {
  id: string;
  name: string;
  master: {
    id: string;
    username: string;
    email: string;
  };
}

export default function Home() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [roomName, setRoomName] = useState('');

  const [createRoom, { loading: createRoomLoading }] = useMutation<CreateRoomResponse>(CREATE_ROOM, {
    onCompleted: (data: CreateRoomResponse) => {
      console.log('Room created successfully:', data);
      setRoom(data.createRoom.room);
    },
    onError: (error: Error) => {
      console.error('Create room error:', error);
      alert('Failed to create room: ' + error.message);
    }
  });

  // Set up ActionCable subscription for game updates
  useEffect(() => {
    if (isAuthenticated && room?.id && typeof window !== 'undefined') {
      const cable = createCableConsumer();

      const sub = cable.subscriptions.create(
        { 
          channel: 'GraphqlChannel',
          room_id: room.id
        },
        {
          received(data: { game?: string; status?: string; move?: unknown }) {
            console.log('Room updated via ActionCable:', data);
            
            // Show notification
            alert(`Room Update Received!\n${JSON.stringify(data, null, 2)}`);
          },
          connected() {
            console.log('Connected to GraphqlChannel for room:', room.id);
          },
          disconnected() {
            console.log('Disconnected from GraphqlChannel');
          }
        }
      );
      
      return () => {
        if (sub) {
          sub.unsubscribe();
        }
      };
    }
  }, [isAuthenticated, room?.id]);

  // Handle body overflow when modal is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (showCreateRoomModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [showCreateRoomModal]);

  const handleCreateNewRoom = async () => {
    console.log('Creating new room...');
    
    try {
      await createRoom({
        variables: {
          input: {
            name: roomName || `Room by ${user?.username || 'User'} - ${new Date().toLocaleTimeString()}`,
          }
        }
      });
      setShowCreateRoomModal(false);
      setRoomName('');
    } catch (err) {
      console.error('Error creating room:', err);
    }
  };

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
                  <button 
                    onClick={() => setShowCreateRoomModal(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create New Room
                  </button>
                  
                  {room && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Current Room:</h3>
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        <p><strong>ID:</strong> {room.id}</p>
                        <p><strong>Name:</strong> {room.name}</p>
                        <p><strong>Master:</strong> {room.master.username} ({room.master.email})</p>
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

      {/* Create Room Modal */}
      {showCreateRoomModal && (
        <>
          {/* Backdrop with animation */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => {
              setShowCreateRoomModal(false);
              setRoomName('');
            }}
          ></div>
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 pointer-events-auto animate-slideUp">
              
              {/* Modal Content */}
              <div className="px-6 py-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
                  Create New Room
                </h2>
                
                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                  Enter a name for your game room to start playing with friends
                </p>

                {/* Input Field */}
                <div className="mb-6">
                  <input
                    id="roomName"
                    type="text"
                    placeholder="Enter room name (optional)"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !createRoomLoading) {
                        handleCreateNewRoom();
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    autoFocus
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowCreateRoomModal(false);
                    setRoomName('');
                  }}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewRoom}
                  disabled={createRoomLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {createRoomLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
