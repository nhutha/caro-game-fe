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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar
          username={user?.username}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full" />
            </div>
            <p className="text-slate-400 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar
        username={user?.username}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <RoomListing
        isLoading={isLoadingRooms}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
