'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { RoomListing } from '@/components/ui/RoomListing';
import { useAuth } from '@/contexts/AuthContext';

export default function BrowsePage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleJoinRoom = (roomId: string) => {
    console.log('Joining room:', roomId);
    // TODO: Implement room joining logic
    router.push(`/game/${roomId}`);
  };

  const handleCreateRoom = () => {
    console.log('Create new room');
    // TODO: Navigate to game page or trigger create room modal
    router.push('/?create=true');
  };

  const handleRefresh = async () => {
    setIsLoadingRooms(true);
    try {
      // TODO: Fetch rooms from API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoadingRooms(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="inline-block">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-spin" />
                <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />
      <RoomListing
        isLoading={isLoadingRooms}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
